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
  useEffect(() => { setText(String(value)); }, [value]);
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
