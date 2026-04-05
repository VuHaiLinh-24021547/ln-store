import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { effectiveUnitPrice } from "@/lib/pricing";

function formatPrice(vnd: number) {
  return new Intl.NumberFormat("vi-VN").format(vnd) + " ₫";
}

export function CartPage() {
  const { lines, setQuantity, removeItem, subtotal, total, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
        <p className="text-slate-600">Giỏ hàng của bạn đang trống.</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Giỏ hàng</h1>
      <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {lines.map(({ product, quantity }) => {
          const unit = effectiveUnitPrice(product);
          const lineTotal = unit * quantity;
          const max = product.stockQuantity;
          const canInc = quantity < max;

          return (
            <li
              key={product.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <img
                src={product.coverImageUrl}
                alt=""
                className="h-28 w-20 shrink-0 rounded border border-slate-100 object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${product.id}`}
                  className="font-medium text-slate-800 hover:text-primary"
                >
                  {product.title}
                </Link>
                <p className="text-sm text-slate-500">{product.author}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Đơn giá:{" "}
                  <span className="font-semibold text-primary">
                    {formatPrice(unit)}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  Tối đa {max} cuốn trong kho
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:items-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Số lượng</span>
                  <div className="flex items-center rounded-md border border-slate-300">
                    <button
                      type="button"
                      aria-label="Giảm"
                      className="px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-8 px-2 text-center text-sm font-medium text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Tăng"
                      className="px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                      disabled={!canInc}
                      onClick={() => setQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-right text-sm font-semibold text-slate-800">
                  Thành tiền: {formatPrice(lineTotal)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-sm text-red-600 hover:underline sm:text-right"
                >
                  Xóa
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Tóm tắt thanh toán
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <dt>Tạm tính</dt>
              <dd className="font-medium text-slate-800">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-primary">
              <dt>Tổng cộng</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-slate-500">
            Giá đã gồm khuyến mãi (nếu có). Phí vận chuyển tính ở bước thanh
            toán.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <button
            type="button"
            onClick={clear}
            className="rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:bg-white"
          >
            Xóa giỏ
          </button>
          <Link
            to="/checkout"
            className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
