export function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-slate-900">{title}</h2>
      <p className="max-w-lg text-sm text-slate-600">
        Mục này là placeholder cho vai trò Admin. Nội dung sẽ được bổ sung
        sau.
      </p>
    </div>
  );
}
