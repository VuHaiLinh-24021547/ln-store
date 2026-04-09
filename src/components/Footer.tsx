import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-primary">LN Store</p>
            <p className="mt-2 text-sm text-slate-600">
              Cửa hàng light novel — giao nhanh, đóng gói cẩn thận, hỗ trợ tận
              tình.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Liên kết</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-primary">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary">
                  Giỏ hàng
                </Link>
              </li>
              
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Hỗ trợ</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Hotline: 1900-xxxx</li>
              <li>Email: support@lnstore.vn</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LN Store. Prototype — dữ liệu mẫu từ
          json-server.
        </p>
      </div>
    </footer>
  );
}
