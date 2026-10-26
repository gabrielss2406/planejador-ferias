const PATHS = {
  up: 'M3.5 9.5 8 5l4.5 4.5',
  down: 'M3.5 6.5 8 11l4.5-4.5',
  check: 'M3 8.5 6.5 12 13 4.5',
  half: 'M3 8h10',
  cross: 'M4 4l8 8M12 4l-8 8',
  mark: 'M8 3v10M3 8h10',
  download: 'M8 2.5v7.5M4.5 6.5 8 10l3.5-3.5M3 13.5h10',
  calendar: 'M3 4.5h10v9H3zM3 7.5h10M5.5 2.5v3M10.5 2.5v3',
  bookmark: 'M4 2.5h8v11L8 10.5 4 13.5z',
  settings: 'M2.5 5h6M11.5 5h2M2.5 11h2M7.5 11h6M10 3v4M6 9v4',
} as const;

export type IconName = keyof typeof PATHS;

/** Ícone de traço único (16px, 2px, pontas redondas). Decorativo: o estado vem sempre em texto ao lado. */
export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="ic" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
