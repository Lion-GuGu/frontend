export function SectionTitle({ children }) {
  return <h2 className="text-xl font-semibold mb-4">{children}</h2>;
}

export function CareCard({ title, meta = [], emphasis }) {
  return (
    <div className={`rounded-xl border bg-white p-4 ${emphasis ? "ring-2 ring-blue-300" : ""}`}>
      <div className="text-sm text-gray-500 mb-1">{meta[0]}</div>
      <div className="font-semibold mb-1">{title}</div>
      <ul className="text-xs text-gray-600 space-y-0.5">
        {meta.slice(1).map((m, i) => <li key={i}>{m}</li>)}
      </ul>
    </div>
  );
}
