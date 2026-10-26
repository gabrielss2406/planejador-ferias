import { useId, useRef, useState } from 'react';
import type { Settings } from '../lib/types';
import { Icon } from './Icon';
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

  return (
    <>
      <button ref={btn} type="button" className="fab" aria-haspopup="dialog" aria-expanded={open} onClick={show}>
        <Icon name="settings" />Mais opções
      </button>
      <dialog ref={dlg} className="drawer" aria-labelledby={title}
        onClose={() => { setOpen(false); btn.current?.focus(); }}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        <div className="drawer-head">
          <h2 id={title}>Mais opções</h2>
          <button type="button" className="drawer-close" onClick={() => dlg.current?.close()}>
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
