interface MenuItem {
  key: string;
  href: string;
}

export const menuItems: MenuItem[] = [
  { key: 'menu.home', href: '/dashboard' },
  { key: 'menu.orders', href: '/dashboard/orders' },
  { key: 'menu.products', href: '/dashboard/products' },
  { key: 'menu.account', href: '/dashboard/account' },
];