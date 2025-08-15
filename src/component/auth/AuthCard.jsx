export default function AuthCard({ title, children }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
      <h1 className="text-center text-xl font-bold text-[#455266]">{title}</h1>
      <div className="mt-4">{children}</div>
    </div>
  );
}
