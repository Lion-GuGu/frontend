// src/components/home/TopBar.jsx
import LocationLoginBar from "./top/LocationLoginBar";
import LogoSearchRow from "./top/LogoSearchRow";
import MainNavBar from "./top/MainNavBar";

export default function TopBar({
  locationText = "📍 경상북도 구미시 금오산로6길 12 아이파크더샵",
  onSearch = () => {},
  cartTotal = "$57.00",
  activeTab = "홈",
  onChangeTab = () => {},
  onCalendarClick = () => {},
}) {
  return (
    <header className="w-full border-b border-gray-200">
      <LocationLoginBar locationText={locationText} />
      <LogoSearchRow onSearch={onSearch} cartTotal={cartTotal} />
      <MainNavBar
        active={activeTab}
        onChange={onChangeTab}
        onCalendarClick={onCalendarClick}
      />
    </header>
  );
}
