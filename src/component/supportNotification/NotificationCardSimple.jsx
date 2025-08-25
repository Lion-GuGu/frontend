import React from "react";

export default function NotificationCardSimple() {
  return (
    <div className="flex items-center bg-gray-100 px-4 py-3 rounded-lg shadow-sm w-[500px]">
      <span className="text-gray-800">
        돌봄 시간이 지났어요~ 완료되었으면 완료를 눌러주세요
      </span>
    </div>
  );
}
