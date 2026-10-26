import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';
import { validCode, validId } from './store.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};
const MAX_BODY = 4096;

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readJson(req) {
  return new Promise((ok, fail) => {
    let size = 0, big = false;
    const parts = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) big = true; // segue lendo e descarta, para poder responder 413 sem cortar a conexão
      else parts.push(c);
    });
    req.on('end', () => {
      if (big) return fail(new Error('too_big'));
      try { ok(JSON.parse(Buffer.concat(parts).toString('utf8') || 'null')); } catch { fail(new Error('bad_json')); }
    });
    req.on('error', fail);
  });
}

/** Limite simples por IP: dificulta varrer os 100 mil códigos possíveis. */
function limiter(max, windowMs, now) {
  const hits = new Map();
  return (ip) => {
    const t = now();
    if (hits.size > 5000) for (const [k, v] of hits) if (t > v.reset) hits.delete(k);
    const h = hits.get(ip);
    if (!h || t > h.reset) { hits.set(ip, { n: 1, reset: t + windowMs }); return true; }
    h.n++;
    return h.n <= max;
  };
}

export function createApp(store, { distDir = null, now = () => Date.now(), maxPerMinute = 90 } = {}) {
  const allow = limiter(maxPerMinute, 60_000, now);

  async function api(req, res, path) {
    const ip = req.socket.remoteAddress ?? '?';
    if (!allow(ip)) return send(res, 429, { error: 'too_many' });
    const seg = path.split('/').filter(Boolean); // api rooms [code] [members id]
    try {
      if (seg[1] !== 'rooms') return send(res, 404, { error: 'not_found' });
      if (seg.length === 2 && req.method === 'POST') {
        const code = store.createRoom();
        return code ? send(res, 201, { code }) : send(res, 503, { error: 'full' });
      }
      const code = seg[2];
      if (!validCode(code)) return send(res, 400, { error: 'invalid' });
      if (seg.length === 3 && req.method === 'GET') {
        const me = req.headers['x-member-id'];
        const members = store.getRoom(code, typeof me === 'string' ? me : '');
        return members ? send(res, 200, { code, members }) : send(res, 404, { error: 'not_found' });
      }
      if (seg.length === 5 && seg[3] === 'members' && validId(seg[4])) {
        if (req.method === 'PUT') {
          const r = store.upsertMember(code, seg[4], (await readJson(req)) ?? {});
          const status = { ok: 200, not_found: 404, full: 409, invalid: 400 }[r];
          return send(res, status, r === 'ok' ? { ok: true } : { error: r });
        }
        if (req.method === 'DELETE') {
          store.removeMember(code, seg[4]);
          return send(res, 200, { ok: true });
        }
      }
      return send(res, 404, { error: 'not_found' });
    } catch (e) {
      if (e.message === 'too_big') return send(res, 413, { error: 'too_big' });
      if (e.message === 'bad_json') return send(res, 400, { error: 'invalid' });
      console.error(e);
      return send(res, 500, { error: 'server' });
    }
  }

  function serveStatic(res, path) {
    if (!distDir) { res.writeHead(404); return res.end(); }
    let clean;
    try { clean = normalize(decodeURIComponent(path)).replace(/^([/\\])+/, ''); } catch { res.writeHead(400); return res.end(); }
    let file = join(distDir, clean);
    if (file !== distDir && !file.startsWith(distDir + sep)) { res.writeHead(403); return res.end(); }
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(distDir, 'index.html');
    const long = file.replaceAll('\\', '/').includes('/assets/');
    res.writeHead(200, {
      'content-type': MIME[extname(file)] ?? 'application/octet-stream',
      'cache-control': long ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    createReadStream(file).pipe(res);
  }

  return (req, res) => {
    const path = (req.url ?? '/').split('?')[0];
    if (path.startsWith('/api/')) { void api(req, res, path); return; }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    serveStatic(res, path);
  };
}
