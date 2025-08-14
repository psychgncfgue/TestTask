export const buildProductsPath = (productsState: {
  currentType: string | null;
  productTypes: string[];
  currentPage: number | null;
}) => {
  const { currentType, productTypes, currentPage } = productsState;
  const type = currentType && productTypes.includes(currentType) ? currentType : 'all';
  const page = currentPage || 1;
  return `/dashboard/products/${type}/${page}`;
};

export const buildOrdersPath = (ordersState: { currentPage: number | null }) => {
  const page = ordersState.currentPage || 1;
  return `/dashboard/orders/${page}`;
};