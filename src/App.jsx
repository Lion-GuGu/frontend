import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/main/MainPage.jsx";
import Schedule from "./pages/schedule/Schedule.jsx";
import ScheduleMonth from "./pages/scheduleMonth/ScheduleMonth.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/scheduleMonth" element={<ScheduleMonth />} />
    </Routes>
  );
}
