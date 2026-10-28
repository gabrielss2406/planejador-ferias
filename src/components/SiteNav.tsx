import { useId, useRef, useState } from 'react';
import { Icon } from './Icon';
import { canAnimate, reduced } from './motion';

const ITEMS = [
  { id: 'plano', label: 'Meu plano' },
  { id: 'salvos', label: 'Planos salvos' },
  { id: 'grupo', label: 'Férias em grupo' },
  { id: 'como-funciona', label: 'Como funciona' },
] as const;

/** Vai até a seção; se for um bloco recolhido (details), abre antes de rolar. */
function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el instanceof HTMLDetailsElement) el.open = true;
  el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  const head = el instanceof HTMLDetailsElement ? el.querySelector('summary') : el.querySelector('h2');
  head?.setAttribute('tabindex', head.tagName === 'SUMMARY' ? '0' : '-1');
  (head as HTMLElement | null)?.focus({ preventScroll: true });
}

/** Barra de navegação no cabeçalho; no celular vira um menu lateral (gaveta pela esquerda). */
export function SiteNav({ hasSaved }: { hasSaved: boolean }) {
  const btn = useRef<HTMLButtonElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const pending = useRef<string | null>(null);
  const closing = useRef(false);
  const [open, setOpen] = useState(false);
  const title = useId();

  const show = () => {
    const d = dlg.current;
    if (!d || d.open) return;
    d.showModal();
    setOpen(true);
  };

  /** Fecha com saída curta (classe closing); sem animação ativa, fecha direto. Esc, Fechar, fundo e links passam por aqui. */
  const requestClose = () => {
    const d = dlg.current;
    if (!d || !d.open || closing.current) return;
    if (!canAnimate(d)) { d.close(); return; }
    closing.current = true;
    d.classList.add('closing');
    const finish = () => { if (d.open) d.close(); };
    const running = d.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation && a.animationName.endsWith('-sai'));
    if (!running.length) { finish(); return; }
    Promise.allSettled(running.map((a) => a.finished)).then(finish);
    window.setTimeout(finish, 400); // rede de segurança
  };

  const pick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (dlg.current?.open) { pending.current = id; requestClose(); } else goTo(id);
  };

  const links = (cls: string) => (
    <ul className={cls}>
      {ITEMS.filter((it) => it.id !== 'salvos' || hasSaved).map((it) => (
        <li key={it.id}>
          <a href={`#${it.id}`} onClick={(e) => pick(e, it.id)}>{it.label}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav className="nav" aria-label="Seções da página">{links('nav-list')}</nav>
      <button ref={btn} type="button" className="nav-btn" aria-haspopup="dialog" aria-expanded={open} onClick={show}>
        <Icon name="menu" />Menu
      </button>
      <dialog ref={dlg} className="sidebar" aria-labelledby={title}
        onCancel={(e) => { if (!closing.current) { e.preventDefault(); requestClose(); } }}
        onClose={() => {
          closing.current = false; dlg.current?.classList.remove('closing'); setOpen(false);
          const id = pending.current; pending.current = null;
          if (id) goTo(id); else btn.current?.focus();
        }}
        onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}>
        <div className="sidebar-head">
          <h2 id={title}>Menu</h2>
          <button type="button" className="drawer-close" onClick={requestClose}><Icon name="cross" />Fechar</button>
        </div>
        <nav aria-label="Seções da página">{links('side-list')}</nav>
      </dialog>
    </>
  );
}
