export interface NavigationLink {
  label: string;
  path: string;
}

export const MAIN_NAV_LINKS: NavigationLink[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Produtos', path: '/products' },
  { label: 'Carrinho', path: '/cart' },
];
