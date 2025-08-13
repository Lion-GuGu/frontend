// src/components/home/BottomFooter.jsx
import logo from "../../assets/logo.svg";
import nameMark from "../../assets/whitename.svg";

export default function BottomFooter() {
  return (
    <footer className="w-full bg-neutral-900 text-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <img src={logo} alt="품아이 로고" className="h-6 w-6" />
          <img src={nameMark} alt="품아이" className="h-6" />
        </div>
        <div className="mt-4 text-sm">📞 (054) 123-4567</div>
      </div>
    </footer>
  );
}
