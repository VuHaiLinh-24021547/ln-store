import { NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/admin", end: true, label: "Dashboard Overview" },
  { to: "/admin/products", end: false, label: "Manage Products" },
  { to: "/admin/customers", end: false, label: "Manage Customers" },
  { to: "/admin/statistics", end: false, label: "Statistics" },
] as const;

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-slate-100">
        <div className="border-b border-slate-700 px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            LN Store
          </p>
          <p className="text-lg font-bold text-white">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {nav.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-700 p-3">
          <NavLink
            to="/"
            className="block rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ← Về cửa hàng
          </NavLink>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Admin Dashboard
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
