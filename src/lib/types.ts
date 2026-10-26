export type HolidayKind = 'nacional' | 'estadual' | 'municipal' | 'facultativo' | 'extra';

export interface Holiday {
  name: string;
  kind: HolidayKind;
}

export type KeyDateType = 'incluir' | 'evitar' | 'folga';

export interface KeyDate {
  id: string;
  label: string;
  start: string;
  end: string;
  type: KeyDateType;
}

export interface Settings {
  year: number;
  city: string;
  uf: string;
  total: number;
  parts: Record<1 | 2 | 3, boolean>;
  minPart: number;
  maxMin: number;
  wStart: string;
  wEnd: string;
  months: boolean[];
  carnaval: boolean;
  corpus: boolean;
  penal: boolean;
  split: number;
  custom: KeyDate[];
}

/** Um período de férias (s..e) e a folga contínua que ele gera (xs..xe). */
export interface Period {
  s: number;
  e: number;
  L: number;
  xs: number;
  xe: number;
  gain: number;
  waste: number;
  hits: number;
  score: number;
  weekendGain?: number;
  holGain?: { d: number; name: string }[];
  holInside?: { d: number; name: string }[];
}

export interface PlanOption {
  k: number;
  score: number;
  periods: Period[];
  off: number;
  gain: number;
  set?: Set<number>;
}

export type GroupKey = 'all' | '1' | '2' | '3';

export interface PlanResult {
  hol: Map<number, Holiday>;
  isOff: (i: number) => boolean;
  wS: number;
  wE: number;
  blocked: Set<number>;
  must: number[];
  N: number;
  uf: string;
  ck: string | null;
  groups: Record<GroupKey, PlanOption[]>;
  error: string | null;
}

/** Período de um plano salvo: só datas (índices de dia) e tamanho, sem pontuação do motor. */
export interface SavedPeriod {
  s: number;
  e: number;
  L: number;
  xs: number;
  xe: number;
}

/** Plano guardado como foto: não depende dos parâmetros que o geraram. */
export interface SavedPlan {
  id: string;
  year: number;
  N: number;
  off: number;
  k: number;
  periods: SavedPeriod[];
  savedAt: number;
}

/** O que o resumo em texto precisa de um plano (serve ao plano calculado e ao salvo). */
export interface PlanLike {
  off: number;
  periods: SavedPeriod[];
}
