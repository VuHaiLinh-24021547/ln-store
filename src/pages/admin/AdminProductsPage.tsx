import { useCallback, useEffect, useState } from "react";
import { deleteProduct } from "@/api/adminClient";
import { getGenres, getProducts } from "@/api/client";
import { effectiveUnitPrice, hasDiscount } from "@/lib/pricing";
import type { Genre, Product } from "@/types";
import { AdminProductModal } from "./AdminProductModal";

function formatPrice(vnd: number) {
  return new Intl.NumberFormat("vi-VN").format(vnd) + " ₫";
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setListError(null);
    try {
      const [p, g] = await Promise.all([getProducts(), getGenres()]);
      setProducts(p);
      setGenres(g);
    } catch {
      setListError(
        "Không tải được dữ liệu. Hãy chạy json-server: npm run api (ghi db.json).",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(row: Product) {
    setModalMode("edit");
    setEditing(row);
    setModalOpen(true);
  }

  async function handleDelete(row: Product) {
    if (
      !window.confirm(
        `Xóa sản phẩm "${row.title}" (ID: ${row.id})? Thao tác ghi vào db.json.`,
      )
    ) {
      return;
    }
    try {
      await deleteProduct(row.id);
      await load();
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "Xóa thất bại. Kiểm tra API.",
      );
    }
  }

  const existingIds = products.map((p) => p.id);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Products</h2>
          <p className="mt-1 text-sm text-slate-600">
            UC-04 — Thêm / sửa / xóa sách. Dữ liệu lưu qua json-server vào{" "}
            <code className="rounded bg-slate-200 px-1 text-xs">db.json</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-dark"
        >
          Add New Product
        </button>
      </div>

      {loading && <p className="text-slate-500">Đang tải…</p>}
      {listError && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {listError}
        </p>
      )}

      {!loading && !listError && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const sale = effectiveUnitPrice(p);
                const disc = hasDiscount(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">
                      {p.id}
                    </td>
                    <td className="px-4 py-2">
                      <img
                        src={p.coverImageUrl}
                        alt=""
                        className="h-14 w-10 rounded border border-slate-200 object-cover"
                      />
                    </td>
                    <td className="max-w-[220px] px-4 py-3">
                      <p className="line-clamp-2 font-medium text-slate-800">
                        {p.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-slate-500">
                        {p.author}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        {disc && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(p.price)}
                          </span>
                        )}
                        <span className="font-semibold text-primary">
                          {formatPrice(sale)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {p.stockQuantity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="rounded border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-500">
              Chưa có sản phẩm. Nhấn &quot;Add New Product&quot;.
            </p>
          )}
        </div>
      )}

      <AdminProductModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        genres={genres}
        existingIds={existingIds}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
