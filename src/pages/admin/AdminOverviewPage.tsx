import { Link } from "react-router-dom";

export function AdminOverviewPage() {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-slate-900">
        Dashboard Overview
      </h2>
      <p className="mb-8 max-w-2xl text-sm text-slate-600">
        Tổng quan hệ thống quản trị. Dùng thanh bên để quản lý sản phẩm, khách
        hàng và thống kê.
      </p>
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
          <p className="mt-2 text-xs text-slate-500">Sắp có.</p>
        </div>
      </div>
    </div>
  );
}
