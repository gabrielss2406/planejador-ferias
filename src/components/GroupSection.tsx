import { useEffect, useState, type FormEvent } from 'react';
import { idx, MN } from '../lib/dates';
import { groupSummaryText, joinNames, overlaps, type GroupMember } from '../lib/group';
import { downloadGroupTicket } from '../lib/groupImage';
import type { SavedPlan } from '../lib/types';
import { NAME_MAX, type GroupApi } from '../hooks/useGroup';
import { Icon } from './Icon';
import { plural, short } from './format';
import { CopyButton } from './planParts';

interface Props {
  group: GroupApi;
  /** plano que a pessoa escolheu (o que o grupo vê) */
  chosen: SavedPlan | null;
  year: number;
}

const range = (s: number, e: number) => `${short(s)} a ${short(e)}`;

/** Régua do ano: uma linha por pessoa, com as férias em azul e os dias em que coincidem com alguém em âmbar. */
function GroupRuler({ members, year }: { members: GroupMember[]; year: number }) {
  const j1 = idx(year, 0, 1), total = idx(year, 11, 31) - j1 + 1;
  const pct = (i: number) => ((i - j1) / total) * 100;
  const ov = overlaps(members, year);
  const shown = members.filter((m) => m.plan?.year === year);
  if (!shown.length) return null;
  return (
    <div className="gr">
      <div className="gr-row gr-head" aria-hidden="true">
        <span />
        <div className="ruler-months">
          {MN.map((m, k) => <span key={m} style={{ flex: idx(year, k + 1, 1) - idx(year, k, 1) }}>{m.slice(0, 3)}</span>)}
        </div>
      </div>
      {shown.map((m) => {
        const mine = ov.filter((o) => o.pids.includes(m.pid));
        const label = `${m.name}${m.me ? ' (você)' : ''}: férias de ${m.plan!.periods.map((p) => range(p.s, p.e)).join('; ')}.`;
        return (
          <div key={m.pid} className="gr-row">
            <span className="gr-name">{m.name}{m.me && <small> (você)</small>}</span>
            <div className="gr-track" role="img" aria-label={label}>
              {m.plan!.periods.map((p, i) => (
                <i key={i} className="v" style={{ left: pct(p.s) + '%', width: ((p.e - p.s + 1) / total) * 100 + '%' }} />
              ))}
              {mine.map((o, i) => (
                <i key={'o' + i} className="o" style={{ left: pct(o.s) + '%', width: ((o.e - o.s + 1) / total) * 100 + '%' }} />
              ))}
            </div>
          </div>
        );
      })}
      <p className="ruler-leg" aria-hidden="true">
        <span><i className="v" />Férias</span><span><i className="o" />Coincide com alguém do grupo</span>
      </p>
    </div>
  );
}

function MemberList({ members, year }: { members: GroupMember[]; year: number }) {
  return (
    <ul className="gm-list">
      {members.map((m) => (
        <li key={m.pid}>
          <b>{m.name}{m.me && ' (você)'}</b>
          {!m.plan && <span>ainda não escolheu um plano</span>}
          {m.plan && m.plan.year !== year && <span>escolheu um plano de {m.plan.year}</span>}
          {m.plan && m.plan.year === year && (
            <span className="mono">{m.plan.periods.map((p) => range(p.s, p.e)).join(' · ')}<small>{m.plan.off} dias fora</small></span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function GroupSection({ group, chosen, year }: Props) {
  const { code, name, members, busy, error } = group;
  const [open, setOpen] = useState(!!code);
  const [nick, setNick] = useState(name);
  const [typed, setTyped] = useState('');
  const [draft, setDraft] = useState(name);
  useEffect(() => { setDraft(name); }, [name]);

  const create = (e: FormEvent) => { e.preventDefault(); void group.create(nick); };
  const join = (e: FormEvent) => { e.preventDefault(); void group.join(typed, nick); };
  const ov = code ? overlaps(members, year) : [];
  const withPlan = members.filter((m) => m.plan?.year === year).length;

  return (
    <details className="group" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary><h2>Férias em grupo{code ? ` (${plural(members.length || 1, 'pessoa', 'pessoas')})` : ''}</h2></summary>

      {!code ? (
        <div className="gcard">
          <p className="hint">Compare suas férias com as de quem vai combinar com você. Cada pessoa entra com o mesmo código de 5 números e escolhe o próprio plano.</p>
          <div className="field">
            <label htmlFor="g-nick">Seu apelido no grupo</label>
            <input id="g-nick" type="text" maxLength={NAME_MAX} autoComplete="nickname" value={nick} onChange={(e) => setNick(e.target.value)} />
          </div>
          <form className="g-join" onSubmit={join}>
            <div className="field">
              <label htmlFor="g-code">Código do grupo</label>
              <input id="g-code" type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} placeholder="00000" autoComplete="off"
                value={typed} onChange={(e) => setTyped(e.target.value.replace(/\D/g, '').slice(0, 5))} />
            </div>
            <button type="submit" className="mini" disabled={busy || typed.length !== 5}>Entrar no grupo</button>
          </form>
          <form onSubmit={create}>
            <button type="submit" className="mini" disabled={busy}>Criar um grupo novo</button>
          </form>
          <p className="hint">Quem tem o código vê seu apelido e as datas do plano que você escolheu. Mais nada.</p>
          {error && <p className="g-err" role="alert">{error}</p>}
        </div>
      ) : (
        <div className="gcard">
          <div className="g-top">
            <div>
              <span className="lbl" id="g-code-l">Código do grupo</span>
              <p className="g-code mono" aria-labelledby="g-code-l">{code}</p>
            </div>
            <CopyButton className="mini" label="Copiar código" text={code} context={`do grupo ${code}`} />
          </div>
          <form className="g-name" onSubmit={(e) => { e.preventDefault(); group.rename(draft); }}>
            <div className="field">
              <label htmlFor="g-me">Seu apelido</label>
              <input id="g-me" type="text" maxLength={NAME_MAX} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => group.rename(draft)} />
            </div>
          </form>
          {!chosen && <p className="g-note">Você ainda não escolheu um plano. Em Escolha um plano, toque em Escolher este plano para o grupo ver suas datas.</p>}
          {error && <p className="g-err" role="alert">{error}</p>}

          <MemberList members={members} year={year} />
          <GroupRuler members={members} year={year} />

          <div className="g-ov" aria-live="polite">
            {ov.length > 0 && (
              <>
                <h3>Férias ao mesmo tempo em {year}</h3>
                <ul>
                  {ov.map((o) => (
                    <li key={o.s}><span className="mono">{range(o.s, o.e)}</span> {joinNames(o.names)} <small>({plural(o.e - o.s + 1, 'dia', 'dias')})</small></li>
                  ))}
                </ul>
              </>
            )}
            {ov.length === 0 && withPlan >= 2 && <p className="hint">Ninguém tem férias ao mesmo tempo em {year}.</p>}
            {withPlan < 2 && members.length > 0 && <p className="hint">Quando mais de uma pessoa escolher um plano de {year}, os dias em comum aparecem aqui.</p>}
          </div>

          <div className="g-act">
            {withPlan > 0 && <CopyButton className="mini" label="Copiar resumo do grupo" text={groupSummaryText(members, year)} context={`do grupo ${code}`} />}
            <button type="button" className="mini" disabled={withPlan === 0} onClick={() => void downloadGroupTicket(members, year)}>
              <Icon name="download" />Salvar ticket do grupo
            </button>
            <button type="button" className="mini" onClick={() => { group.leave(); setOpen(true); }}>Sair do grupo</button>
          </div>
          {withPlan === 0 && <p className="hint">O ticket do grupo fica disponível quando alguém escolher um plano de {year}.</p>}
        </div>
      )}
    </details>
  );
}
