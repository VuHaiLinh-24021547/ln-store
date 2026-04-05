import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getGenres, getProducts } from "@/api/client";
import { ProductCard } from "@/components/ProductCard";
import type { Genre, Product } from "@/types";

export function GenresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("genre") ?? "";

  const [genres, setGenres] = useState<Genre[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getGenres(), getProducts()])
      .then(([g, p]) => {
        if (!cancelled) {
          setGenres(g);
          setProducts(p);
        }
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

  const activeGenre = useMemo(
    () => genres.find((g) => g.slug === slug),
    [genres, slug],
  );

  const filtered = useMemo(() => {
    if (!activeGenre) return products;
    return products.filter((p) => p.genreId === activeGenre.id);
  }, [products, activeGenre]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Thể loại</h1>
      <p className="mb-6 text-sm text-slate-600">
        Lọc theo thể loại light novel.
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSearchParams({})}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !slug
              ? "bg-primary text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Tất cả
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSearchParams({ genre: g.slug })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              slug === g.slug
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate-500">Đang tải...</p>}
      {error && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          {activeGenre && (
            <p className="mb-4 text-sm text-slate-600">
              Đang xem: <strong>{activeGenre.name}</strong> —{" "}
              <Link to="/genres" className="text-primary hover:underline">
                Xóa lọc
              </Link>
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-slate-500">Không có sản phẩm trong mục này.</p>
          )}
        </>
      )}
    </div>
  );
}
