import { useEffect, useId, useRef, useState } from 'react';
import { searchCities, type City } from '../lib/api';
import { norm } from '../lib/dates';
import { CITIES, findCity } from '../lib/holidays';
import type { Settings } from '../lib/types';

interface Props {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  describedBy?: string;
}

/** Sem servidor: filtra a lista curta que o app já traz. */
const localCities = (q: string): City[] => {
  const k = norm(q);
  return Object.entries(CITIES)
    .filter(([name]) => norm(name).includes(k))
    .slice(0, 8)
    .map(([nome, [uf]]) => ({ ibge: '', nome, uf }));
};

/** Campo de cidade com sugestões de qualquer município (API), no padrão combobox. */
export function CityPicker({ settings: S, update, describedBy }: Props) {
  const id = useId();
  const [items, setItems] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const focused = useRef(false);

  // sugestões: só enquanto digita e ainda não escolheu um município da lista
  useEffect(() => {
    const q = S.city.trim();
    if (!focused.current || S.ibge || q.length < 2) { setItems([]); return; }
    const ctl = new AbortController();
    const t = window.setTimeout(() => {
      searchCities(q, '', ctl.signal)
        .then((r) => { setItems(r); setActive(-1); setOpen(true); })
        .catch((e) => { if (e?.name !== 'AbortError') { setItems(localCities(q)); setActive(-1); setOpen(true); } });
    }, 200);
    return () => { window.clearTimeout(t); ctl.abort(); };
  }, [S.city, S.ibge]);

  const type = (city: string) => {
    const ck = findCity(city);
    update({ city, ibge: undefined, cityHol: undefined, cityInfo: undefined, ...(ck ? { uf: CITIES[ck][0] } : {}) });
  };
  const pick = (c: City) => {
    update({ city: c.nome, uf: c.uf, ibge: c.ibge || undefined, cityHol: undefined, cityInfo: undefined });
    setOpen(false); setItems([]);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (!open || !items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(items[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  const listId = `${id}-list`;
  const show = open && items.length > 0;
  return (
    <>
      <input type="text" id="city" role="combobox" aria-expanded={show} aria-controls={listId} aria-autocomplete="list"
        aria-activedescendant={show && active >= 0 ? `${id}-o${active}` : undefined}
        placeholder="Digite sua cidade" autoComplete="off" aria-label="Cidade" aria-describedby={describedBy}
        value={S.city} onChange={(e) => type(e.target.value)} onKeyDown={onKey}
        onFocus={() => { focused.current = true; if (items.length) setOpen(true); }}
        onBlur={() => { focused.current = false; setOpen(false); }} />
      <ul id={listId} role="listbox" aria-label="Cidades encontradas" className="cp-list" hidden={!show}>
        {items.map((c, i) => (
          <li key={c.ibge || c.nome} id={`${id}-o${i}`} role="option" aria-selected={i === active} className={i === active ? 'on' : ''}
            onMouseDown={(e) => { e.preventDefault(); pick(c); }}>
            <span>{c.nome}</span><span className="mono">{c.uf}</span>
          </li>
        ))}
      </ul>
      <span className="sr" role="status">{show ? `${items.length} cidades encontradas` : ''}</span>
    </>
  );
}
