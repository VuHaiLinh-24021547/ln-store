import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/api/client";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Không tải được sản phẩm. Hãy chạy json-server: npm run api",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="mb-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-10 text-white shadow-md">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Light Novel chính hãng
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/90 md:text-base">
          Khám phá bộ sưu tập mới, bán chạy và nhiều thể loại — giao hàng toàn
          quốc.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/new"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-primary shadow hover:bg-slate-50"
          >
            Mới phát hành
          </Link>
          <Link
            to="/bestsellers"
            className="rounded-md border border-white/80 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Bán chạy
          </Link>
        </div>
      </section>

      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Sản phẩm nổi bật
      </h2>

      {loading && (
        <p className="text-slate-500">Đang tải danh sách...</p>
      )}
      {error && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </p>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
