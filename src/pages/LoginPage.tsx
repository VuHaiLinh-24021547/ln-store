import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">
        Đăng nhập
      </h1>
      <p className="mb-8 text-center text-sm text-slate-600">
        Trang mẫu — xác thực thật sẽ được tích hợp sau.
      </p>
      <form
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Đăng nhập
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link to="/" className="text-primary hover:underline">
          ← Về trang chủ
        </Link>
      </p>
    </div>
  );
}
