import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/main/MainPage.jsx";
import Schedule from "./pages/schedule/Schedule.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </BrowserRouter>
  );
}
