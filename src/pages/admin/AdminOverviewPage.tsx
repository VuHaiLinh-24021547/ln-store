import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/api/client";
import { getOrders, getUsers } from "@/api/adminClient";
import type { Order, Product, User } from "@/types";

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function AdminOverviewPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getUsers(), getProducts(), getOrders()])
      .then(([u, p, o]) => {
        if (!cancelled) {
          setUsers(u);
          setProducts(p);
          setOrders(o);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Không tải được dữ liệu. Hãy chạy json-server: npm run api",
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

  const totalCustomers = users.length;
  const totalProducts = products.length;
  const totalOrdersSold = orders.filter((o) => o.status === "completed")
    .length;

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-slate-900">
        Dashboard Overview
      </h2>
      <p className="mb-8 max-w-2xl text-sm text-slate-600">
        Tổng quan hệ thống quản trị. Dùng thanh bên để quản lý sản phẩm, khách
        hàng và thống kê.
      </p>

      {loading && (
        <p className="mb-8 text-sm text-slate-500">Đang tải số liệu...</p>
      )}
      {error && (
        <p className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-sky-200/80 bg-sky-50 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-sky-900/80">
                  Tổng số khách hàng
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-sky-950">
                  {totalCustomers}
                </p>
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700"
                aria-hidden
              >
                <UsersIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-900/80">
                  Tổng số sản phẩm
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-950">
                  {totalProducts}
                </p>
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
                aria-hidden
              >
                <BookIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-violet-200/80 bg-violet-50 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-violet-900/80">
                  Đơn hàng đã bán
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-violet-950">
                  {totalOrdersSold}
                </p>
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700"
                aria-hidden
              >
                <CartIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/products"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-slate-800">
            Manage Products
          </p>
          <p className="mt-2 text-sm text-slate-500">
            CRUD sách — cập nhật trực tiếp cơ sở dữ liệu mock (json-server /
            db.json).
          </p>
        </Link>
        <Link
          to="/admin/customers"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-slate-800">
            Manage Customers
          </p>
          <p className="mt-2 text-sm text-slate-500">
            UC-05 — Ban / Unban, đồng bộ db.json qua json-server.
          </p>
        </Link>
        <div className="rounded-lg border border-dashed border-slate-300 bg-white/80 p-6">
          <p className="text-sm font-semibold text-slate-800">Statistics</p>
          <p className="mt-2 text-xs text-slate-500">
            Số liệu tổng quan hiển thị phía trên khi API chạy.
          </p>
        </div>
      </div>
    </div>
  );
}
