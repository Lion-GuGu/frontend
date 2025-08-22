// src/pages/main/MainPage.jsx
import { useState, useEffect } from "react";
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

  // 다른 페이지에서 navigate('/', { state:{ tab } })로 들어올 때마다 매번 소비
  useEffect(() => {
    const next = location.state?.tab;
    if (next) {
      setTab(next);
      // state 비워서 내부 탭 전환 시 다시 덮어쓰지 않게
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const handleCalendarClick = () => {
    // App.jsx 라우트가 /schedule 이므로 여기도 동일하게
    navigate("/schedule");
    // 만약 /calendar 를 쓰고 싶다면 App.jsx에 해당 라우트 추가해도 OK
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <TopBar
        activeTab={tab}
        onChangeTab={setTab}
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
