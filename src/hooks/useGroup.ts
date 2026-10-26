import { useCallback, useEffect, useRef, useState } from 'react';
import type { GroupMember } from '../lib/group';
import type { SavedPlan } from '../lib/types';

const CONN_KEY = 'planejador-ferias-group-v1';
const ID_KEY = 'planejador-ferias-member-v1';
export const POLL_MS = 20_000;
export const NAME_MAX = 24;

interface Conn { code: string; name: string }

const MESSAGES: Record<string, string> = {
  not_found: 'Não achei um grupo com esse código. Confira os 5 números.',
  full: 'Esse grupo já tem 20 pessoas.',
  invalid: 'Preencha seu apelido (até 24 letras).',
  too_many: 'Muitas tentativas seguidas. Espere um minuto e tente de novo.',
  offline: 'Não consegui falar com o servidor. Tente de novo em instantes.',
  server: 'O servidor teve um problema. Tente de novo em instantes.',
};
const messageOf = (code: string) => MESSAGES[code] ?? MESSAGES.server;

/** Identidade anônima deste navegador: é o que autoriza editar o próprio apelido e plano na sala. */
function memberId() {
  try {
    const saved = localStorage.getItem(ID_KEY);
    if (saved) return saved;
    const id = crypto.randomUUID();
    localStorage.setItem(ID_KEY, id);
    return id;
  } catch { return crypto.randomUUID(); }
}

function loadConn(): Conn | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONN_KEY) ?? 'null');
    return c && /^\d{5}$/.test(c.code) && typeof c.name === 'string' && c.name ? { code: c.code, name: c.name } : null;
  } catch { return null; }
}

async function call(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const res = await fetch(path, init);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch { return { ok: false, status: 0, data: { error: 'offline' } }; }
}

const json = (method: string, body: unknown): RequestInit => ({ method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

/**
 * Grupo de férias: sala de 5 dígitos no servidor. Publica o plano escolhido (e o apelido) sempre que mudam
 * e lê os colegas ao entrar, ao voltar para a aba e a cada 20 s.
 */
export function useGroup(chosen: SavedPlan | null) {
  const [conn, setConn] = useState<Conn | null>(loadConn);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const id = useRef(memberId());
  const published = useRef('');
  const chosenRef = useRef(chosen);
  chosenRef.current = chosen;

  useEffect(() => {
    try { if (conn) localStorage.setItem(CONN_KEY, JSON.stringify(conn)); else localStorage.removeItem(CONN_KEY); } catch { /* ignora */ }
  }, [conn]);

  const read = useCallback(async (code: string) => {
    const r = await call(`/api/rooms/${code}`, { headers: { 'x-member-id': id.current } });
    if (r.ok) { setMembers(r.data.members ?? []); setError(''); return; }
    if (r.status === 404) { setConn(null); setMembers([]); setError('Esse grupo não existe mais (some depois de 90 dias sem uso).'); return; }
    setError(messageOf(r.data?.error ?? 'server'));
  }, []);

  const put = useCallback((code: string, name: string, plan: SavedPlan | null) =>
    call(`/api/rooms/${code}/members/${id.current}`, json('PUT', { name, plan })), []);

  // publica quando muda o apelido ou o plano escolhido
  const sig = conn ? `${conn.code}|${conn.name}|${chosen?.id ?? ''}` : '';
  useEffect(() => {
    if (!conn || published.current === sig) return;
    published.current = sig;
    void put(conn.code, conn.name, chosenRef.current).then((r) => {
      if (!r.ok) { published.current = ''; setError(messageOf(r.data?.error ?? 'offline')); } else void read(conn.code);
    });
  }, [sig, conn, put, read]);

  // lê ao abrir, a cada 20 s e quando a aba volta a ficar visível
  useEffect(() => {
    if (!conn) return;
    void read(conn.code);
    const tick = () => { if (document.visibilityState === 'visible') void read(conn.code); };
    const t = window.setInterval(tick, POLL_MS);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(t); document.removeEventListener('visibilitychange', tick); };
  }, [conn?.code, read]); // eslint-disable-line react-hooks/exhaustive-deps

  const enter = useCallback(async (code: string, name: string) => {
    const r = await put(code, name, chosenRef.current);
    if (!r.ok) { setError(messageOf(r.data?.error ?? 'offline')); return false; }
    published.current = `${code}|${name}|${chosenRef.current?.id ?? ''}`;
    setError('');
    setConn({ code, name });
    return true;
  }, [put]);

  const create = useCallback(async (name: string) => {
    const nm = name.trim().slice(0, NAME_MAX);
    if (!nm) { setError(MESSAGES.invalid); return false; }
    setBusy(true);
    const r = await call('/api/rooms', { method: 'POST' });
    const ok = r.ok ? await enter(r.data.code, nm) : (setError(messageOf(r.data?.error ?? 'offline')), false);
    setBusy(false);
    return ok;
  }, [enter]);

  const join = useCallback(async (code: string, name: string) => {
    const nm = name.trim().slice(0, NAME_MAX);
    if (!/^\d{5}$/.test(code)) { setError(MESSAGES.not_found); return false; }
    if (!nm) { setError(MESSAGES.invalid); return false; }
    setBusy(true);
    const ok = await enter(code, nm);
    setBusy(false);
    return ok;
  }, [enter]);

  const rename = useCallback((name: string) => {
    const nm = name.trim().slice(0, NAME_MAX);
    if (nm) setConn((c) => (c ? { ...c, name: nm } : c));
  }, []);

  const leave = useCallback(() => {
    if (conn) void call(`/api/rooms/${conn.code}/members/${id.current}`, { method: 'DELETE' });
    published.current = '';
    setConn(null); setMembers([]); setError('');
  }, [conn]);

  return { code: conn?.code ?? null, name: conn?.name ?? '', members, busy, error, create, join, rename, leave, clearError: () => setError('') };
}

export type GroupApi = ReturnType<typeof useGroup>;
