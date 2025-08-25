// src/pages/schedule/ScheduleWeek.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./scheduleWeek.module.css";
import ScheduleModal from "../../component/cal/ScheduleModal";
import { useEvents } from "./EventContext";
import { Link } from "react-router-dom";
import nameMark from "../../assets/name.svg";
import logo from "../../assets/logo.svg";
import cal from "../../assets/cal.svg";
import Premium from "../../assets/Premium.svg";
import { fetchEvents } from "../../api/Events";

moment.locale("ko");
const localizer = momentLocalizer(moment);

// 2025년 8월 17일 - 23일
function formatWeekRange(date) {
  const start = moment(date).startOf("week");
  const end = moment(date).endOf("week");
  return `${start.format("YYYY M월 D일")} - ${end.format("D일")}`;
}

// 좌측 미니 달력
function MiniMonth({ value, onChange }) {
  const m = moment(value);
  const days = [];
  const start = moment(value).startOf("month");
  const end = moment(value).endOf("month");
  const cursor = start.clone();

  while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
    days.push(cursor.clone());
    cursor.add(1, "day");
  }

  return (
    <div className={styles.miniMonth}>
      <div className={styles.miniMonthHeader}>
        <button
          className={styles.navBtn}
          onClick={() => onChange(moment(value).subtract(1, "month").toDate())}
        >
          ‹
        </button>
        <div className={styles.miniMonthTitle}>{m.format("YYYY년 M월")}</div>
        <button
          className={styles.navBtn}
          onClick={() => onChange(moment(value).add(1, "month").toDate())}
        >
          ›
        </button>
      </div>
      <div className={styles.miniMonthDows}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className={styles.dowCell}>
            {d}
          </div>
        ))}
      </div>
      <div className={styles.miniMonthGrid}>
        {days.map((d) => {
          const isToday = d.isSame(moment(), "day");
          const isOther = !d.isSame(m, "month");
          const isSelected = d.isSame(moment(value), "day");
          return (
            <button
              key={d.format("YYYY-MM-DD")}
              className={[
                styles.miniDay,
                isOther ? styles.otherMonth : "",
                isToday ? styles.today : "",
                isSelected ? styles.selected : "",
              ].join(" ")}
              onClick={() => onChange(d.toDate())}
            >
              <span>{d.date()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 이벤트 렌더링
function CustomEvent({ event }) {
  return (
    <div
      className={styles.eventItem}
      style={{
        backgroundColor: event.color || "#8ab4f8",
        color: "white",
      }}
    >
      <span className={styles.eventDot} style={{ backgroundColor: "#fff" }} />
      <span className={styles.eventTitle}>{event.title}</span>
    </div>
  );
}

// 실시간 시간 표시
function CurrentTimeIndicator() {
  const [topPx, setTopPx] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const container = document.querySelector(".rbc-time-content");
      if (container) {
        const slotHeight = container.offsetHeight / 24; // 24시간 기준
        const newTop = hour * slotHeight + (minute / 60) * slotHeight;
        setTopPx(newTop);
      }
    };

    update();
    const interval = setInterval(update, 60000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: topPx,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "red",
        zIndex: 1000,
      }}
    />
  );
}

export default function ScheduleWeek() {
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [slotForModal, setSlotForModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [isWeekView, setIsWeekView] = useState(true);

  const onSelectSlot = (slot) => {
    setSlotForModal({ start: slot.start, end: slot.end });
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const onSelectEvent = (event) => {
    setSelectedEvent(event);
    setSlotForModal({ start: event.start, end: event.end });
    setModalOpen(true);
  };

  const components = useMemo(
    () => ({ toolbar: () => null, event: CustomEvent }),
    []
  );

  const eventPropGetter = (event) => {
    const color = event.color || "#8ab4f8";
    return {
      style: {
        backgroundColor: color,
        border: `1px solid ${color}AA`,
        borderRadius: 6,
        padding: "2px 6px",
        fontSize: 12,
        color: "white",
      },
    };
  };

  const formats = useMemo(
    () => ({
      timeGutterFormat: (date) => moment(date).format("HH:mm"),
      dayFormat: (date) => moment(date).format("D일"),
      weekdayFormat: (date) =>
        ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][
          date.getDay()
        ],
    }),
    []
  );

  const recalcNowLine = () => {
    const holder = holderRef.current;
    if (!holder) return;

    const grid = holder.querySelector(".rbc-time-content");
    const gutter = holder.querySelector(".rbc-time-gutter");
    if (!grid || !gutter) return;

    const holderRect = holder.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const gutterRect = gutter.getBoundingClientRect();

    const firstGroup = grid.querySelector(".rbc-timeslot-group");
    if (!firstGroup) return;

    const slotHeight = firstGroup.getBoundingClientRect().height;
    const now = new Date();
    const y = slotHeight * (now.getHours() + now.getMinutes() / 60);

    const top = y - grid.scrollTop;
    const left = gutterRect.right - holderRect.left;
    const width = grid.clientWidth;

    // 화면 안에 있으면 상태 업데이트, 아니면 null 처리
    if (top < 0 || top > grid.clientHeight) {
      setNowTop(null);
      setNowLeft(null);
      setNowWidth(null);
    } else {
      setNowTop(top);
      setNowLeft(left);
      setNowWidth(width);
    }
  };

  const handleRangeChange = async (range) => {
    if (!range) return;
    const start = Array.isArray(range) ? range[0] : range.start;
    const end = Array.isArray(range) ? range[range.length - 1] : range.end;

    const data = await fetchEvents(start, end);
    setEvents(data);
  };

  return (
    <div className={styles.pageWrap}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.link}>
          <img
            src={logo}
            alt="품아이 로고"
            className="h-9 w-9 md:h-10 md:w-10"
          />
          <img src={nameMark} alt="품아이" className="h-8 md:h-9" />
        </Link>

        <MiniMonth value={date} onChange={setDate} />

        {/* 단지 일정 */}
        <div className={styles.calendarList}>
          <div className={styles.header}>
            <img className={styles.calednar} src={cal} alt="달력" />
            <div className={styles.sectionTitle}>단지 일정</div>
          </div>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#f28b82" }} />
            긴급
          </label>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#f6bf26" }} />
            돌봄
          </label>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#33b679" }} />
            교육
          </label>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#8ab4f8" }} />
            기타
          </label>
        </div>

        {/* 내 일정 */}
        <div className={styles.calendarList}>
          <div className={styles.header}>
            <img className={styles.calednar} src={cal} alt="달력" />
            <div className={styles.sectionTitle}>내 일정</div>
          </div>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#ED8611" }} />내
            일정
          </label>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.leftControls}>
            <div className={styles.titleMonth}>{formatWeekRange(date)}</div>
            <div className={styles.viewSwitch}>
              <select
                value={isWeekView ? "week" : "month"}
                onChange={(e) => setIsWeekView(e.target.value === "week")}
                className={styles.selectView}
              >
                <option value="week">주</option>
                <option value="month">월</option>
              </select>
              <img src={Premium} alt="화살표" className={styles.arrowIcon} />
            </div>
          </div>
        </div>

        <div style={{ position: "relative", height: "calc(100vh - 112px)" }}>
          <Calendar
            localizer={localizer}
            date={date}
            onNavigate={setDate}
            selectable
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={onSelectSlot}
            onSelectEvent={onSelectEvent}
            onRangeChange={handleRangeChange}
            eventPropGetter={eventPropGetter}
            components={components}
            formats={formats}
            view={isWeekView ? "week" : "month"}
          />
          {isWeekView && <CurrentTimeIndicator />}
        </div>

        {modalOpen && (
          <ScheduleModal
            slot={slotForModal}
            event={selectedEvent}
            onClose={() => setModalOpen(false)}
            onAdd={addEvent}
            onUpdate={updateEvent}
            onDelete={deleteEvent}
          />
        )}
      </main>
    </div>
  );
}
