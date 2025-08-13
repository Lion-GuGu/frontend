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

        {/* 전화: SVG 아이콘 + 흰색 링크 */}
        <a
          href="tel:+82541234567"
          className="mt-4 inline-flex items-center gap-2 text-sm
                     text-white visited:text-white hover:text-white
                     decoration-white hover:underline"
          aria-label="전화 걸기 (054) 123-4567"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25A2.25 2.25 0 0 0 21.75 19.5v-1.372c0-.52-.36-.97-.87-1.09l-4.5-1.125c-.33-.083-.68.01-.92.25l-1.18 1.178a12.06 12.06 0 0 1-5.34-5.343l1.178-1.177c.24-.24.333-.59.25-.92L7.462 3.852a1.125 1.125 0 0 0-1.09-.852H5A2.25 2.25 0 0 0 2.75 5.25v1.5z" />
          </svg>
          <span className="text-white">(054) 123-4567</span>
        </a>
      </div>
    </footer>
  );
}
