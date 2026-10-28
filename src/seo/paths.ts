export const paths = {
  guia: '/guia-ferias-clt/',
  dividir: '/como-dividir-ferias-clt/',
  abono: '/abono-pecuniario-vender-ferias/',
  aviso: '/aviso-pagamento-ferias-coletivas/',
  privacidade: '/privacidade/',
  termos: '/termos/',
  sobre: '/sobre/',
  contato: '/contato/',
  feriados: (y: number) => `/feriados-${y}/`,
  melhores: (y: number) => `/melhores-datas-ferias-${y}/`,
  estado: (y: number, uf: string) => `/feriados-${y}/${uf.toLowerCase()}/`,
};
