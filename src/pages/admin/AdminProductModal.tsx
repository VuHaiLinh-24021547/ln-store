import { useEffect, useState } from "react";
import { createProduct, updateProduct } from "@/api/adminClient";
import type { Genre, Product, ProductBadge } from "@/types";

type Mode = "add" | "edit";

function emptyDraft(): Product {
  return {
    id: "",
    title: "",
    author: "",
    price: 0,
    discountPrice: null,
    coverImageUrl:
      "https://placehold.co/280x400/337ab7/ffffff?text=Light+Novel",
    description: "",
    genreId: "1",
    stockQuantity: 0,
    badge: null,
  };
}

function badgeToSelect(b: ProductBadge): string {
  if (b === "new" || b === "bestseller") return b;
  return "";
}

export function AdminProductModal({
  open,
  mode,
  initial,
  genres,
  existingIds,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: Mode;
  initial: Product | null;
  genres: Genre[];
  existingIds: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Product>(() => emptyDraft());
  const [discountInput, setDiscountInput] = useState("");
  const [badgeSelect, setBadgeSelect] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (mode === "edit" && initial) {
      setForm({ ...initial });
      setDiscountInput(
        initial.discountPrice != null ? String(initial.discountPrice) : "",
      );
      setBadgeSelect(badgeToSelect(initial.badge));
    } else {
      const d = emptyDraft();
      if (genres[0]) d.genreId = genres[0].id;
      setForm(d);
      setDiscountInput("");
      setBadgeSelect("");
    }
  }, [open, mode, initial, genres]);

  if (!open) return null;

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const idTrim = form.id.trim();
    if (!idTrim) {
      setError("ID không được để trống.");
      return;
    }
    if (mode === "add" && existingIds.includes(idTrim)) {
      setError("ID đã tồn tại. Chọn ID khác.");
      return;
    }
    if (!form.title.trim()) {
      setError("Tiêu đề không được để trống.");
      return;
    }
    if (form.price < 0 || !Number.isFinite(form.price)) {
      setError("Giá không hợp lệ.");
      return;
    }
    const discRaw = discountInput.trim();
    let discountPrice: number | null = null;
    if (discRaw !== "") {
      const d = Number(discRaw);
      if (!Number.isFinite(d) || d < 0) {
        setError("Giá khuyến mãi không hợp lệ.");
        return;
      }
      discountPrice = d;
    }
    if (
      discountPrice != null &&
      discountPrice > 0 &&
      discountPrice >= form.price
    ) {
      setError("Giá khuyến mãi phải nhỏ hơn giá niêm yết (hoặc để trống).");
      return;
    }
    if (form.stockQuantity < 0 || !Number.isFinite(form.stockQuantity)) {
      setError("Tồn kho không hợp lệ.");
      return;
    }

    const badge: ProductBadge =
      badgeSelect === "new" || badgeSelect === "bestseller"
        ? badgeSelect
        : null;

    const payload: Product = {
      ...form,
      id: mode === "edit" && initial ? initial.id : idTrim,
      title: form.title.trim(),
      author: form.author.trim(),
      discountPrice,
      badge,
    };

    setSubmitting(true);
    try {
      if (mode === "add") {
        await createProduct(payload);
      } else if (initial) {
        await updateProduct(initial.id, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-product-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h2
            id="admin-product-modal-title"
            className="text-lg font-bold text-slate-900"
          >
            {mode === "add" ? "Thêm sản phẩm" : "Sửa sản phẩm"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              ID
            </label>
            <input
              type="text"
              required
              disabled={mode === "edit"}
              value={form.id}
              onChange={(e) => setField("id", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Tiêu đề
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Tác giả
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setField("author", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Giá (VND)
              </label>
              <input
                type="number"
                min={0}
                required
                value={form.price || ""}
                onChange={(e) =>
                  setField("price", Number(e.target.value) || 0)
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Giá KM (để trống = không)
              </label>
              <input
                type="number"
                min={0}
                placeholder="—"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              URL ảnh bìa
            </label>
            <input
              type="text"
              value={form.coverImageUrl}
              onChange={(e) => setField("coverImageUrl", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Thể loại
              </label>
              <select
                value={form.genreId}
                onChange={(e) => setField("genreId", e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Tồn kho
              </label>
              <input
                type="number"
                min={0}
                value={form.stockQuantity}
                onChange={(e) =>
                  setField("stockQuantity", Number(e.target.value) || 0)
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Huy hiệu
            </label>
            <select
              value={badgeSelect}
              onChange={(e) => setBadgeSelect(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Không</option>
              <option value="new">Mới phát hành</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {submitting ? "Đang lưu…" : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
