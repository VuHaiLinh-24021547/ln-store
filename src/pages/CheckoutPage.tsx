import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { effectiveUnitPrice } from "@/lib/pricing";

function formatPrice(vnd: number) {
  return new Intl.NumberFormat("vi-VN").format(vnd) + " ₫";
}

type PaymentMethod = "cod" | "bank";

export function CheckoutPage() {
  const { lines, subtotal, total, clear } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");

  const handleConfirm = () => {
    if (lines.length === 0) return;
    alert("Order Placed!");
    clear();
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Thanh toán</h1>
      <p className="mb-8 text-sm text-slate-600">
        Điền thông tin giao hàng và xác nhận đơn hàng.
      </p>

      {lines.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-700">Giỏ hàng trống — không thể thanh toán.</p>
          <Link
            to="/cart"
            className="mt-4 inline-block text-primary hover:underline"
          >
            ← Quay lại giỏ hàng
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,380px)]">
          <div className="space-y-8">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Shipping Address
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Địa chỉ nhận hàng
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-primary/30 focus:border-primary focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-primary/30 focus:border-primary focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Địa chỉ
                  </label>
                  <textarea
                    id="checkout-address"
                    rows={3}
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-primary/30 focus:border-primary focus:ring-2"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Payment Method
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Chọn hình thức thanh toán
              </p>
              <fieldset className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="mt-1 text-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">
                      COD — Thanh toán khi nhận hàng
                    </span>
                    <span className="text-xs text-slate-500">
                      Trả tiền mặt cho shipper khi giao hàng.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={payment === "bank"}
                    onChange={() => setPayment("bank")}
                    className="mt-1 text-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">
                      Bank Transfer — Chuyển khoản ngân hàng
                    </span>
                    <span className="text-xs text-slate-500">
                      Chuyển khoản theo hướng dẫn sau khi đặt hàng.
                    </span>
                  </span>
                </label>
              </fieldset>
            </section>
          </div>

          <aside className="lg:sticky lg:top-4 h-fit space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Order Summary
              </h2>
              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm text-slate-700">
                {lines.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="flex justify-between gap-3 border-b border-slate-200/80 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="min-w-0">
                      <span className="line-clamp-2 font-medium text-slate-800">
                        {product.title}
                      </span>
                      <span className="text-slate-500"> × {quantity}</span>
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatPrice(effectiveUnitPrice(product) * quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>Tạm tính</dt>
                  <dd className="font-medium text-slate-800">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between text-base font-bold text-primary">
                  <dt>Tổng cộng</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-slate-500">
                Phương thức:{" "}
                {payment === "cod"
                  ? "COD"
                  : "Chuyển khoản"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-white shadow hover:bg-primary-dark"
            >
              Confirm Order
            </button>
            <Link
              to="/cart"
              className="block text-center text-sm text-primary hover:underline"
            >
              ← Quay lại giỏ hàng
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
