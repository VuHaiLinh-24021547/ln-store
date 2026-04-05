import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGenres, getProduct } from "@/api/client";
import { useCart } from "@/context/CartContext";
import { effectiveUnitPrice, hasDiscount } from "@/lib/pricing";
import type { Genre, Product } from "@/types";

function formatPrice(vnd: number) {
  return new Intl.NumberFormat("vi-VN").format(vnd) + " ₫";
}

function stockLabel(q: number) {
  if (q <= 0) return { text: "Hết hàng", className: "text-red-600 bg-red-50" };
  if (q < 5) {
    return {
      text: `Sắp hết hàng (còn ${q})`,
      className: "text-amber-800 bg-amber-50",
    };
  }
  return {
    text: `Còn hàng (${q} cuốn)`,
    className: "text-emerald-800 bg-emerald-50",
  };
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [cartHint, setCartHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [genreName, setGenreName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getProduct(id), getGenres()])
      .then(([data, genres]) => {
        if (cancelled) return;
        setProduct(data);
        const g = genres.find((x: Genre) => x.id === data.genreId);
        setGenreName(g?.name ?? null);
      })
      .catch(() => {
        if (!cancelled) setError("Không tìm thấy sản phẩm hoặc API chưa chạy.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="text-slate-500">Đang tải...</p>;
  }
  if (error || !product) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-6">
        <p className="text-slate-700">{error ?? "Không có dữ liệu."}</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const p = product;
  const discounted = hasDiscount(p);
  const salePrice = effectiveUnitPrice(p);
  const stock = stockLabel(p.stockQuantity);
  const inStock = p.stockQuantity > 0;

  function handleAdd() {
    if (!inStock) return;
    const ok = addItem(p, 1);
    if (!ok) {
      if (hintTimer.current) clearTimeout(hintTimer.current);
      setCartHint("Đã đạt số lượng tối đa trong kho.");
      hintTimer.current = setTimeout(() => setCartHint(null), 3000);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-12">
      <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
        <img
          src={p.coverImageUrl}
          alt=""
          className="w-full rounded-xl border border-slate-200 shadow-lg"
        />
      </div>
      <div>
        {p.badge && (
          <span className="mb-2 inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {p.badge === "new" ? "Mới phát hành" : "Bán chạy"}
          </span>
        )}
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          {p.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{p.author}</p>
        {genreName && (
          <p className="mt-2 text-sm text-slate-500">
            Thể loại:{" "}
            <span className="font-medium text-slate-700">{genreName}</span>
          </p>
        )}
        <span
          className={`mt-4 inline-block rounded-md px-3 py-1 text-sm font-medium ${stock.className}`}
        >
          {stock.text}
        </span>
        <div className="mt-6 flex flex-wrap items-baseline gap-3">
          {discounted && (
            <span className="text-lg text-slate-400 line-through">
              {formatPrice(p.price)}
            </span>
          )}
          <p className="text-3xl font-bold text-primary">
            {formatPrice(salePrice)}
          </p>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-slate-700 md:text-base">
          {p.description}
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!inStock}
              onClick={handleAdd}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {inStock ? "Thêm vào giỏ" : "Hết hàng"}
            </button>
            <Link
              to="/cart"
              className="rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Xem giỏ hàng
            </Link>
          </div>
          {cartHint && (
            <p className="text-sm text-amber-800">{cartHint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
