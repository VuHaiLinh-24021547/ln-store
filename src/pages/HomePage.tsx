import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/api/client";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

type StockFilter = "all" | "in_stock" | "out_of_stock";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (stockFilter === "in_stock" && p.stockQuantity <= 0) return false;
      if (stockFilter === "out_of_stock" && p.stockQuantity !== 0)
        return false;
      return true;
    });
  }, [products, searchTerm, stockFilter]);

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
        <>
          <div className="mb-6 flex flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 items-start md:flex-row md:items-center">
            <div className="flex w-full flex-col gap-2 md:w-1/2">
              <label
                htmlFor="product-search"
                className="text-sm font-medium text-slate-700"
              >
                Tìm kiếm
              </label>
              <input
                id="product-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm light novel..."
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
            <div className="flex w-full min-w-0 flex-col gap-2 md:flex-1">
              <span
                id="stock-filter-label"
                className="text-sm font-medium text-slate-700"
              >
                Tồn kho
              </span>
              <div
                className="flex flex-row gap-3 items-center"
                role="radiogroup"
                aria-labelledby="stock-filter-label"
              >
                {(
                  [
                    { value: "all" as const, label: "Tất cả" },
                    { value: "in_stock" as const, label: "Còn hàng" },
                    { value: "out_of_stock" as const, label: "Hết hàng" },
                  ] as const
                ).map(({ value, label }) => (
                  <label
                    key={value}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary/30"
                  >
                    <input
                      type="radio"
                      name="stock-filter"
                      value={value}
                      checked={stockFilter === value}
                      onChange={() => setStockFilter(value)}
                      className="h-4 w-4 shrink-0 border-slate-300 text-primary focus:ring-primary/40"
                    />
                    <span className="whitespace-nowrap">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-white py-12 text-center text-slate-600">
              Không tìm thấy sản phẩm nào
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
