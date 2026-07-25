export function TextResult({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-base leading-7 text-ink">
        {value || "Not found"}
      </p>
    </div>
  );
}