import { useEffect, useRef, useState } from 'react';
import { fetchCityHolidays } from '../lib/api';
import type { Settings } from '../lib/types';

export type CityStatus = 'idle' | 'loading' | 'ok' | 'error';

/**
 * Busca na API os feriados municipais do município escolhido (ano do plano e vizinhos) e guarda no
 * Settings. Sem rede, mantém o que já estava e o app segue com feriados nacionais e do estado.
 */
export function useCityHolidays(S: Settings, update: (patch: Partial<Settings>) => void) {
  const [status, setStatus] = useState<CityStatus>('idle');
  const upd = useRef(update);
  upd.current = update;

  useEffect(() => {
    if (!S.ibge) { setStatus('idle'); return; }
    const ibge = S.ibge, year = S.year;
    const ctl = new AbortController();
    setStatus('loading');
    fetchCityHolidays(ibge, [year - 1, year, year + 1], year, ctl.signal)
      .then((r) => {
        upd.current({ cityHol: r.hol, cityInfo: { ibge, count: r.count, inBase: r.inBase } });
        setStatus('ok');
      })
      .catch((e) => { if (e?.name !== 'AbortError') setStatus('error'); });
    return () => ctl.abort();
  }, [S.ibge, S.year]);

  return status;
}
