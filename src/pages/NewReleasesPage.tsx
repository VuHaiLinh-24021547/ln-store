import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/api/client";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

export function NewReleasesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Không tải được dữ liệu. Chạy: npm run api");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.badge === "new"),
    [products],
  );

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        Mới phát hành
      </h1>
      <p className="mb-6 text-sm text-slate-600">
        Các tập light novel mới cập nhật.
      </p>
      {loading && <p className="text-slate-500">Đang tải...</p>}
      {error && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </p>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-slate-500">Chưa có sản phẩm mới trong db mẫu.</p>
      )}
    </div>
  );
}
