import { createRequire } from 'node:module';
import { createHash, randomInt } from 'node:crypto';
import { cleanPlan, validPlan } from '../shared/planShape.mjs';

// via require: o Vite (usado pelo vitest) não resolve o módulo embutido node:sqlite em import estático
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');

export const MAX_MEMBERS = 20;
export const STALE_DAYS = 90;
const ID = /^[A-Za-z0-9-]{8,64}$/;
const CODE = /^\d{5}$/;

export const validCode = (c) => typeof c === 'string' && CODE.test(c);
export const validId = (i) => typeof i === 'string' && ID.test(i);

/** Salas de férias em SQLite. O id do membro é o segredo de edição; o que sai para os outros é um hash curto. */
export function openStore(file = ':memory:', now = () => Date.now()) {
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (code TEXT PRIMARY KEY, created_at INTEGER NOT NULL, touched_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS members (
      room TEXT NOT NULL REFERENCES rooms(code) ON DELETE CASCADE, id TEXT NOT NULL,
      name TEXT NOT NULL, plan_json TEXT, updated_at INTEGER NOT NULL, PRIMARY KEY (room, id));
  `);
  const q = {
    insRoom: db.prepare('INSERT OR IGNORE INTO rooms (code, created_at, touched_at) VALUES (?, ?, ?)'),
    room: db.prepare('SELECT code FROM rooms WHERE code = ?'),
    touch: db.prepare('UPDATE rooms SET touched_at = ? WHERE code = ?'),
    members: db.prepare('SELECT id, name, plan_json, updated_at FROM members WHERE room = ? ORDER BY updated_at, name'),
    count: db.prepare('SELECT COUNT(*) AS n FROM members WHERE room = ?'),
    has: db.prepare('SELECT 1 AS x FROM members WHERE room = ? AND id = ?'),
    upsert: db.prepare(`INSERT INTO members (room, id, name, plan_json, updated_at) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(room, id) DO UPDATE SET name = excluded.name, plan_json = excluded.plan_json, updated_at = excluded.updated_at`),
    del: db.prepare('DELETE FROM members WHERE room = ? AND id = ?'),
    sweep: db.prepare('DELETE FROM rooms WHERE touched_at < ?'),
  };
  const pub = (id) => createHash('sha256').update(id).digest('hex').slice(0, 10);

  return {
    /** Cria uma sala com código livre de 5 dígitos (00000 a 99999). */
    createRoom() {
      for (let i = 0; i < 100; i++) {
        const code = String(randomInt(0, 100000)).padStart(5, '0');
        const t = now();
        if (q.insRoom.run(code, t, t).changes) return code;
      }
      return null;
    },
    /** Membros da sala (com `me` marcando o próprio) ou null se não existe. */
    getRoom(code, meId) {
      if (!q.room.get(code)) return null;
      q.touch.run(now(), code);
      return q.members.all(code).map((m) => ({
        pid: pub(m.id), name: m.name, me: m.id === meId, updatedAt: m.updated_at,
        plan: m.plan_json ? JSON.parse(m.plan_json) : null,
      }));
    },
    /** 'ok' | 'not_found' | 'full' | 'invalid' */
    upsertMember(code, id, { name, plan } = {}) {
      if (!validId(id)) return 'invalid';
      const nm = typeof name === 'string' ? name.trim().slice(0, 24) : '';
      if (!nm) return 'invalid';
      if (plan != null && !validPlan(plan)) return 'invalid';
      if (!q.room.get(code)) return 'not_found';
      if (!q.has.get(code, id) && q.count.get(code).n >= MAX_MEMBERS) return 'full';
      const t = now();
      q.upsert.run(code, id, nm, plan ? JSON.stringify(cleanPlan(plan)) : null, t);
      q.touch.run(t, code);
      return 'ok';
    },
    removeMember(code, id) {
      return q.del.run(code, id).changes > 0;
    },
    /** Apaga salas sem uso há STALE_DAYS dias. */
    sweep() {
      return q.sweep.run(now() - STALE_DAYS * 864e5).changes;
    },
    close() { db.close(); },
  };
}
