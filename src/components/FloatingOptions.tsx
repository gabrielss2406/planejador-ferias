import { useId, useRef, useState } from 'react';
import type { Settings } from '../lib/types';
import { Icon } from './Icon';
import { canAnimate } from './motion';
import { OptionsBody } from './SettingsPanel';

interface Props {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

/** Botão fixo na base da tela que abre "Mais opções" numa gaveta modal. */
export function FloatingOptions({ settings, update }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const title = useId();

  const show = () => {
    const d = dlg.current;
    if (!d || d.open) return;
    d.showModal();
    setOpen(true);
  };

  /** Fecha com saída curta (classe closing); sem animação ativa, fecha direto. Esc, Fechar e fundo passam por aqui. */
  const closing = useRef(false);
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

  return (
    <>
      <button ref={btn} type="button" className="fab" aria-haspopup="dialog" aria-expanded={open} onClick={show}>
        <Icon name="settings" />Mais opções
      </button>
      <dialog ref={dlg} className="drawer" aria-labelledby={title}
        onCancel={(e) => { if (!closing.current) { e.preventDefault(); requestClose(); } }}
        onClose={() => { closing.current = false; dlg.current?.classList.remove('closing'); setOpen(false); btn.current?.focus(); }}
        onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}>
        <div className="drawer-head">
          <h2 id={title}>Mais opções</h2>
          <button type="button" className="drawer-close" onClick={requestClose}>
            <Icon name="cross" />Fechar
          </button>
        </div>
        <div className="drawer-body">
          <OptionsBody settings={settings} update={update} />
        </div>
      </dialog>
    </>
  );
}
