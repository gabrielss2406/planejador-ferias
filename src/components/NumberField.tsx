import { useEffect, useState } from 'react';
import { clamp } from '../lib/dates';

interface Props {
  id: string;
  value: number;
  min: number;
  max: number;
  /** valor usado enquanto o campo está vazio ou inválido */
  fallback: number;
  onChange: (v: number) => void;
}

/** Deixa digitar livremente (ex.: "2" a caminho de "20"); só o valor já limitado vai para o estado. */
export function NumberField({ id, value, min, max, fallback, onChange }: Props) {
  const [text, setText] = useState(String(value));
  // Sincroniza só mudanças externas; não sobrescreve o que o usuário digita (ex.: "2" a caminho de "20").
  useEffect(() => {
    setText((t) => (clamp(parseInt(t, 10) || fallback, min, max) === value ? t : String(value)));
  }, [value, fallback, min, max]);
  return (
    <input
      type="number" id={id} min={min} max={max} step={1} value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(clamp(parseInt(e.target.value, 10) || fallback, min, max));
      }}
      onBlur={() => setText(String(value))}
    />
  );
}
