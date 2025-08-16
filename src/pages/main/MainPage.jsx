import { useState } from "react";
import TopBar from "../../component/main/TopBar";
import MiddleSection from "../home/HomeSection";
import BottomFooter from "../../component/main/BottomFooter";
import Inbox from "../../pages/inbox/Inbox.jsx";

// 다른 탭들의 임시 컴포넌트
function Community() { return <div className="w-full px-4 md:px-8 py-10">커뮤니티 페이지</div>; }
function Store() { return <div className="w-full px-4 md:px-8 py-10">스토어 페이지</div>; }

export default function MainPage() {
  const [tab, setTab] = useState("홈");
  const handleCalendarClick = () => { window.location.href = "/calendar"; };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <TopBar activeTab={tab} onChangeTab={setTab} onCalendarClick={handleCalendarClick} />

      <main className="flex-1 flex flex-col min-h-0">
        {tab === "홈" && <MiddleSection />}
        {tab === "커뮤니티" && <Community />}
        {tab === "스토어" && <Store />}
        {/* '우편함' 탭이 선택되면 import한 Inbox 컴포넌트를 보여줍니다. */}
        {tab === "우편함" && <Inbox />}
      </main>

      <BottomFooter />
    </div>
  );
}
