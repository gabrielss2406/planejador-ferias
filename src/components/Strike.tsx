/**
 * X vermelho de ícone sobre um cartão ou a passagem: dois traços retos, um depois do outro.
 * `draw` anima os traços sendo desenhados; sem `draw`, já aparece pronto. Fica quadrado e centralizado.
 */
export function Strike({ draw }: { draw: boolean }) {
  return (
    <svg className={'strike' + (draw ? ' draw' : '')} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <path className="s1" pathLength={1} d="M22 22 L78 78" />
      <path className="s2" pathLength={1} d="M78 22 L22 78" />
    </svg>
  );
}
