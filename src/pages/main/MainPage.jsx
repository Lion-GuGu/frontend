// src/pages/main/MainPage.jsx
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../component/main/TopBar";
import MiddleSection from "../home/HomeSection";
import BottomFooter from "../../component/main/BottomFooter";
import Inbox from "../../pages/inbox/Inbox.jsx";
import StorePage from "../../pages/main/StorePage.jsx";
import Community from "../../pages/community/CommunityPage.jsx";

export default function MainPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState("홈");
  const consumedStateOnce = useRef(false);

  // 커뮤니티 상세(PostDetailPage) 등에서 넘어올 때 state.tab을 한 번만 반영하고 즉시 비움
  useEffect(() => {
    const next = location.state?.tab;
    if (next && !consumedStateOnce.current) {
      setTab(next);
      consumedStateOnce.current = true;

      // state를 제거하여 이후 내부 탭 전환 시 다시 덮어쓰지 않도록 함
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const handleCalendarClick = () => {
    window.location.href = "/calendar";
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <TopBar
        activeTab={tab}
        onChangeTab={setTab}              // 탭 클릭 시 여기로만 상태 변경
        onCalendarClick={handleCalendarClick}
      />

      <main className="flex-1 flex flex-col min-h-0">
        {tab === "홈" && <MiddleSection />}
        {tab === "커뮤니티" && <Community />}
        {tab === "스토어" && <StorePage />}
        {tab === "우편함" && <Inbox />}
      </main>

      <BottomFooter />
    </div>
  );
}
