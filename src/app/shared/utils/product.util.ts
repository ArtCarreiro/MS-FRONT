import { Product } from '@app/models/product.model';

export type ProductSortKey = 'featured' | 'name' | 'price-asc' | 'price-desc';

export interface ProductFilters {
  category: string;
  searchTerm: string;
}

export function extractProductCategories(products: Product[]): string[] {
  return [...new Set(products.flatMap((product) => tokenizeKeywords(product.keywords)))]
    .sort((left, right) => left.localeCompare(right, 'pt-BR'));
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const normalizedSearch = filters.searchTerm.trim().toLowerCase();
  const normalizedCategory = filters.category.trim().toLowerCase();

  return products.filter((product) => {
    const categoryMatch = normalizedCategory === 'all'
      || tokenizeKeywords(product.keywords).some((keyword) => keyword.toLowerCase() === normalizedCategory);

    const searchMatch = normalizedSearch.length === 0
      || [product.name, product.skuCode, product.keywords]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    return categoryMatch && searchMatch;
  });
}

export function sortProducts(products: Product[], sortKey: ProductSortKey): Product[] {
  const sortedProducts = [...products];

  switch (sortKey) {
    case 'name':
      return sortedProducts.sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
    case 'price-asc':
      return sortedProducts.sort((left, right) => left.price - right.price);
    case 'price-desc':
      return sortedProducts.sort((left, right) => right.price - left.price);
    case 'featured':
    default:
      return sortedProducts.sort((left, right) => Number(right.active) - Number(left.active));
  }
}

export function tokenizeKeywords(keywords: string | null | undefined): string[] {
  return (keywords ?? '')
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}
