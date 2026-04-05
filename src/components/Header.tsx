import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 md:flex-nowrap md:gap-6">
        <Link
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-primary"
        >
          LN Store
        </Link>

        <div className="order-3 flex min-w-0 flex-1 basis-full md:order-none md:basis-auto">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Tìm light novel, tác giả..."
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm text-slate-800 outline-none ring-primary/30 transition focus:border-primary focus:ring-2"
              aria-label="Tìm kiếm"
            />
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 hover:text-primary"
            aria-label="Giỏ hàng"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white"
                aria-live="polite"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <Link
            to="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
