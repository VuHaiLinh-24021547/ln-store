export type ProductBadge = "new" | "bestseller" | null;

/** Light Novel — mock catalog item (UC-01 / chi tiết sản phẩm) */
export interface Product {
  id: string;
  title: string;
  author: string;
  /** Giá niêm yết (VND) */
  price: number;
  /** Giá khuyến mãi; `null` nếu không giảm */
  discountPrice: number | null;
  coverImageUrl: string;
  description: string;
  /** Khóa thể loại (join với `Genre`) */
  genreId: string;
  stockQuantity: number;
  badge: ProductBadge;
}

export interface Genre {
  id: string;
  slug: string;
  name: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export type UserStatus = "active" | "banned";

/** Khách hàng — mock (UC-05) */
export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}
