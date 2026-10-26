/** Movimento por JS (Web Animations): lê os tokens --ease-* e --dur-* do CSS, para ter uma fonte só. */
export const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export const ease = (name: 'out' | 'std') => token(`--ease-${name}`, name === 'out' ? 'cubic-bezier(.16,1,.3,1)' : 'cubic-bezier(.22,1,.36,1)');
export const dur = (name: string, fallback: number) => {
  const v = token(`--dur-${name}`, '');
  return v.endsWith('ms') ? parseFloat(v) : fallback;
};

/** Anima só se o navegador suportar; sempre cancelável, sem estado preso. */
export const canAnimate = (el: Element) => typeof (el as HTMLElement).animate === 'function';
