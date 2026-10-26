const PATHS = {
  up: 'M3.5 9.5 8 5l4.5 4.5',
  down: 'M3.5 6.5 8 11l4.5-4.5',
  check: 'M3 8.5 6.5 12 13 4.5',
  half: 'M3 8h10',
  cross: 'M4 4l8 8M12 4l-8 8',
  mark: 'M8 3v10M3 8h10',
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
