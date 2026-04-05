import type { Product } from "@/types";

export function hasDiscount(product: Product): boolean {
  const d = product.discountPrice;
  return d != null && d > 0 && d < product.price;
}

export function effectiveUnitPrice(product: Product): number {
  if (hasDiscount(product) && product.discountPrice != null) {
    return product.discountPrice;
  }
  return product.price;
}
