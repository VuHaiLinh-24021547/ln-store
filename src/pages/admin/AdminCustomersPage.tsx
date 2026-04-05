import { useCallback, useEffect, useState } from "react";
import { getUsers, updateUser } from "@/api/adminClient";
import type { User } from "@/types";

function BanReasonModal({
  user,
  open,
  reason,
  setReason,
  submitting,
  error,
  onClose,
  onConfirm,
}: {
  user: User | null;
  open: boolean;
  reason: string;
  setReason: (v: string) => void;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ban-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h2
            id="ban-modal-title"
            className="text-lg font-bold text-slate-900"
          >
            Ban khách hàng
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium text-slate-800">{user.name}</span>
            <span className="text-slate-400"> · </span>
            {user.email}
          </p>
        </div>
        <div className="space-y-3 px-5 py-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Lý do ban <span className="text-red-600">*</span>
            </span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Nhập lý do (ví dụ: vi phạm điều khoản, gian lận đơn hàng…)"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-primary/30 focus:border-primary focus:ring-2"
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Đang xử lý…" : "Xác nhận ban"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [banTarget, setBanTarget] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banSubmitting, setBanSubmitting] = useState(false);
  const [banError, setBanError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setListError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setListError(
        "Không tải được người dùng. Chạy json-server: npm run api (ghi db.json).",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function closeBanModal() {
    setBanTarget(null);
    setBanReason("");
    setBanError(null);
  }

  async function confirmBan() {
    if (!banTarget) return;
    const r = banReason.trim();
    if (!r) {
      setBanError("Vui lòng nhập lý do ban.");
      return;
    }
    setBanError(null);
    setBanSubmitting(true);
    try {
      await updateUser(banTarget.id, { ...banTarget, status: "banned" });
      window.alert(`Đã ban khách hàng.\n\nLý do: ${r}`);
      closeBanModal();
      await load();
    } catch (e) {
      setBanError(
        e instanceof Error ? e.message : "Cập nhật thất bại. Kiểm tra API.",
      );
    } finally {
      setBanSubmitting(false);
    }
  }

  async function handleUnban(user: User) {
    if (
      !window.confirm(`Gỡ ban cho ${user.name} (${user.email})?`)
    ) {
      return;
    }
    try {
      await updateUser(user.id, { ...user, status: "active" });
      await load();
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "Cập nhật thất bại. Kiểm tra API.",
      );
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">Manage Customers</h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        UC-05 — Ban / Unban khách hàng. Trạng thái lưu qua json-server vào{" "}
        <code className="rounded bg-slate-200 px-1 text-xs">db.json</code>.
      </p>

      {loading && <p className="mt-6 text-slate-500">Đang tải…</p>}
      {listError && (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {listError}
        </p>
      )}

      {!loading && !listError && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const banned = u.status === "banned";
                return (
                  <tr
                    key={u.id}
                    className={
                      banned
                        ? "border-l-4 border-l-red-500 bg-red-50/90 text-slate-700"
                        : "hover:bg-slate-50/80"
                    }
                  >
                    <td
                      className={`px-4 py-3 font-mono text-xs ${banned ? "text-red-900/80" : "text-slate-700"}`}
                    >
                      {u.id}
                    </td>
                    <td
                      className={`px-4 py-3 font-medium ${banned ? "text-red-950" : "text-slate-900"}`}
                    >
                      {u.name}
                    </td>
                    <td
                      className={`px-4 py-3 ${banned ? "text-red-900/70" : "text-slate-600"}`}
                    >
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      {banned ? (
                        <span className="inline-flex rounded-full bg-red-200 px-2.5 py-0.5 text-xs font-semibold text-red-900">
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {banned ? (
                        <button
                          type="button"
                          onClick={() => handleUnban(u)}
                          className="rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setBanTarget(u);
                            setBanReason("");
                            setBanError(null);
                          }}
                          className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-500">
              Chưa có người dùng trong db.json.
            </p>
          )}
        </div>
      )}

      <BanReasonModal
        user={banTarget}
        open={banTarget !== null}
        reason={banReason}
        setReason={setBanReason}
        submitting={banSubmitting}
        error={banError}
        onClose={closeBanModal}
        onConfirm={confirmBan}
      />
    </div>
  );
}
