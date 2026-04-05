import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { effectiveUnitPrice, hasDiscount } from "@/lib/pricing";
import type { Product } from "@/types";

function formatPrice(vnd: number) {
  return new Intl.NumberFormat("vi-VN").format(vnd) + " ₫";
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [cartHint, setCartHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const discounted = hasDiscount(product);
  const salePrice = effectiveUnitPrice(product);
  const inStock = product.stockQuantity > 0;

  function handleAdd() {
    if (!inStock) return;
    const ok = addItem(product, 1);
    if (!ok) {
      if (hintTimer.current) clearTimeout(hintTimer.current);
      setCartHint("Đã đạt số lượng tối đa trong kho.");
      hintTimer.current = setTimeout(() => setCartHint(null), 3000);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-primary/40 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <img
          src={product.coverImageUrl}
          alt=""
          className="aspect-[7/10] w-full object-cover transition group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        {product.badge && (
          <span className="mb-1 inline-block w-fit rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {product.badge === "new" ? "Mới" : "Bán chạy"}
          </span>
        )}
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-primary"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-xs text-slate-500">{product.author}</p>
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {discounted && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-sm font-bold text-primary">
              {formatPrice(salePrice)}
            </span>
          </div>
          <button
            type="button"
            disabled={!inStock}
            onClick={handleAdd}
            className="mt-2 w-full rounded-md bg-primary py-2 text-xs font-semibold text-white shadow hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {inStock ? "Thêm vào giỏ" : "Hết hàng"}
          </button>
          {cartHint && (
            <p className="mt-1 text-center text-[11px] text-amber-800">
              {cartHint}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
