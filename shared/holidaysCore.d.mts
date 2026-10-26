export const DAY: number;
export const idx: (y: number, m: number, d: number) => number;
export function easter(y: number): number;
export type Entry = [month: number, day: number, name: string, fromYear?: number];
export const FIXED: Entry[];
export const STATE: Record<string, Entry[]>;
export const STATE_CONFIRMED: string[];
export const UFS: string[];
export interface BaseHoliday { i: number; name: string; kind: 'nacional' | 'estadual' | 'facultativo' }
export function baseHolidays(y: number, uf: string, opts?: { carnaval?: boolean; corpus?: boolean }): BaseHoliday[];
