import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-primary text-white"
      : "text-slate-700 hover:bg-slate-100 hover:text-primary",
  ].join(" ");

export function NavBar() {
  return (
    <nav className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-2">
        <NavLink to="/genres" className={linkClass}>
          Thể loại
        </NavLink>
        <NavLink to="/new" className={linkClass}>
          Mới phát hành
        </NavLink>
        <NavLink to="/bestsellers" className={linkClass}>
          Bán chạy
        </NavLink>
      </div>
    </nav>
  );
}
