import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./schedule.module.css";
import ScheduleModal from "../../component/cal/ScheduleModal";

// 자산
import logoSvg from "../../assets/logo.svg";
import nameSvg from "../../assets/name.svg";
import dateSvg from "../../assets/date.svg";

const localizer = momentLocalizer(moment);

/* =====  A. 시스템 스크롤바 숨김 + RBC 헤더 우측 여백 제거(상자 방지)  ===== */
const OVERLAY_SCROLLBAR_CSS = `
  /* 본문 스크롤 컨테이너의 네이티브 스크롤바 숨김 */
  .${styles.calendarHolder} .rbc-time-content {
    scrollbar-width: none;          /* Firefox */
    -ms-overflow-style: none;       /* IE/Edge Legacy */
  }
  .${styles.calendarHolder} .rbc-time-content::-webkit-scrollbar { /* Chromium/WebKit */
    width: 0px; height: 0px;
  }

  /* RBC가 스크롤바 폭만큼 헤더 오른쪽에 margin-right를 넣어 '상자'가 생기는 것 제거 */
  .${styles.calendarHolder} .rbc-time-header.rbc-overflowing .rbc-time-header-content {
    margin-right: 0 !important;
    overflow: hidden;
  }
`;

/* 상단 날짜 헤더: 링크/밑줄 제거 */
const WeekDateHeader = ({ label }) => (
  <span style={{ textDecoration: "none", color: "inherit" }}>{label}</span>
);

// 주간 범위 문자열 포맷
function formatWeekRange(date) {
  const start = moment(date).startOf("week");
  const end = moment(date).endOf("week");
  return `${start.format("YYYY M월 D일")} - ${end.format("D일")}`;
}

// 좌측 미니 달력
function MiniMonth({ value, onChange }) {
  const m = moment(value);
  const start = moment(m).startOf("month").startOf("week");
  const end = moment(m).endOf("month").endOf("week");
  const days = [];
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

export default function Schedule() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slotForModal, setSlotForModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isThisWeek = useMemo(() => moment(date).isSame(moment(), "week"), [date]);

  const holderRef = useRef(null);
  const [nowTop, setNowTop] = useState(null);
  const [nowLeft, setNowLeft] = useState(null);
  // ✅ 너비를 저장할 상태 추가
  const [nowWidth, setNowWidth] = useState(null);

  // ===== B. 커스텀 오버레이 스크롤바 상태 =====
  const [ovTop, setOvTop] = useState(0);
  const [ovHeight, setOvHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbH, setThumbH] = useState(32);
  const [sbVisible, setSbVisible] = useState(false);
  const hideTimerRef = useRef(null);
  const draggingRef = useRef(false);
  const dragStateRef = useRef({ startY: 0, startThumbTop: 0, maxThumbTop: 0, maxScroll: 0 });

  useEffect(() => {
    // no-op
  }, []);

  const measureOverlay = () => {
    const holder = holderRef.current;
    const grid = holder?.querySelector(".rbc-time-content");
    if (!holder || !grid) return;
    const hr = holder.getBoundingClientRect();
    const gr = grid.getBoundingClientRect();
    setOvTop(gr.top - hr.top);
    setOvHeight(gr.height);
  };

  const updateThumb = () => {
    const holder = holderRef.current;
    const grid = holder?.querySelector(".rbc-time-content");
    if (!grid) return;
    const client = grid.clientHeight;
    const scrollH = grid.scrollHeight;
    if (scrollH <= client + 1) {
      setSbVisible(false);
      setThumbTop(0);
      return;
    }
    const ratio = client / scrollH;
    const tH = Math.max(24, Math.round(ovHeight * ratio));
    const maxThumbTop = Math.max(1, ovHeight - tH);
    const top = Math.round((grid.scrollTop / (scrollH - client)) * maxThumbTop);
    setThumbH(tH);
    setThumbTop(top);
  };

  const pingShow = (ms = 900) => {
    setSbVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setSbVisible(false), ms);
  };

  const onThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const holder = holderRef.current;
    const grid = holder?.querySelector(".rbc-time-content");
    if (!grid) return;
    draggingRef.current = true;
    const client = grid.clientHeight;
    const scrollH = grid.scrollHeight;
    const maxScroll = Math.max(1, scrollH - client);
    const maxThumbTop = Math.max(1, ovHeight - thumbH);
    dragStateRef.current = {
      startY: e.clientY,
      startThumbTop: thumbTop,
      maxThumbTop,
      maxScroll,
    };
    document.addEventListener("mousemove", onDocMouseMove);
    document.addEventListener("mouseup", onDocMouseUp);
  };

  const onDocMouseMove = (e) => {
    if (!draggingRef.current) return;
    const holder = holderRef.current;
    const grid = holder?.querySelector(".rbc-time-content");
    if (!grid) return;
    const { startY, startThumbTop, maxThumbTop, maxScroll } = dragStateRef.current;
    const dy = e.clientY - startY;
    const nextThumb = Math.min(Math.max(0, startThumbTop + dy), maxThumbTop);
    setThumbTop(nextThumb);
    const pct = nextThumb / maxThumbTop;
    grid.scrollTop = pct * maxScroll;
    pingShow(1200);
  };

  const onDocMouseUp = () => {
    draggingRef.current = false;
    document.removeEventListener("mousemove", onDocMouseMove);
    document.removeEventListener("mouseup", onDocMouseUp);
  };

  useEffect(() => {
    const holder = holderRef.current;
    const grid = holder?.querySelector(".rbc-time-content");
    if (!grid) return;

    const onScroll = () => {
      updateThumb();
      pingShow(900);
    };
    const onEnter = () => pingShow(600);
    const onMove = () => pingShow(600);
    const onLeave = () => setSbVisible(false);

    measureOverlay();
    updateThumb();

    grid.addEventListener("scroll", onScroll);
    grid.addEventListener("mouseenter", onEnter);
    grid.addEventListener("mousemove", onMove);
    grid.addEventListener("mouseleave", onLeave);
    const onResize = () => {
      measureOverlay();
      updateThumb();
    };
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => {
      measureOverlay();
      updateThumb();
    });
    ro.observe(grid);

    return () => {
      clearTimeout(hideTimerRef.current);
      grid.removeEventListener("scroll", onScroll);
      grid.removeEventListener("mouseenter", onEnter);
      grid.removeEventListener("mousemove", onMove);
      grid.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [date, ovHeight]);

  const recalcNowLine = () => {
    const holder = holderRef.current;
    if (!holder) return;

    const grid = holder.querySelector(".rbc-time-content");
    const gutter = holder.querySelector(".rbc-time-gutter");
    if (!grid || !gutter) return;

    const holderRect = holder.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const gutterRect = gutter.getBoundingClientRect();

    const indicator =
      grid.querySelector(".rbc-current-time-indicator") ||
      holder.querySelector(".rbc-current-time-indicator");

    if (indicator) {
      const style = window.getComputedStyle(indicator);
      const topInGrid = parseFloat(style.top) || 0;
      const top = (gridRect.top - holderRect.top) + (topInGrid - grid.scrollTop);
      const left = gutterRect.right - holderRect.left;
      // ✅ 스크롤 가능한 컨텐츠 영역의 너비를 가져옵니다.
      const width = grid.clientWidth;

      const gridTop = gridRect.top - holderRect.top;
      const gridBottom = gridRect.bottom - holderRect.top;
      if (top < gridTop || top > gridBottom) {
        setNowTop(null);
        setNowLeft(null);
        setNowWidth(null);
      } else {
        setNowTop(top);
        setNowLeft(left);
        setNowWidth(width);
      }
      return;
    }

    // Fallback calculation
    const firstGroup =
      gutter.querySelector(".rbc-timeslot-group") ||
      grid.querySelector(".rbc-timeslot-group");
    if (!firstGroup) return;

    const hourHeight = firstGroup.getBoundingClientRect().height;
    const now = new Date();
    const y = hourHeight * (now.getHours() + now.getMinutes() / 60);
    const top = (gridRect.top - holderRect.top) + y - grid.scrollTop;
    const left = gutterRect.right - holderRect.left;
    const width = grid.clientWidth;

    const gridTop = gridRect.top - holderRect.top;
    const gridBottom = gridRect.bottom - holderRect.top;
    if (top < gridTop || top > gridBottom) {
      setNowTop(null);
      setNowLeft(null);
      setNowWidth(null);
    } else {
      setNowTop(top);
      setNowLeft(left);
      setNowWidth(width);
    }
  };

  useEffect(() => {
    recalcNowLine();

    const holder = holderRef.current;
    const grid = holder?.querySelector(".rbc-time-content");
    const onScroll = () => recalcNowLine();

    grid?.addEventListener("scroll", onScroll);
    window.addEventListener("resize", recalcNowLine);

    const timer = setInterval(recalcNowLine, 30000);
    const lateTick = setTimeout(recalcNowLine, 300);

    return () => {
      clearInterval(timer);
      clearTimeout(lateTick);
      window.removeEventListener("resize", recalcNowLine);
      grid?.removeEventListener("scroll", onScroll);
    };
  }, [date]);

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
  const onAddEvent = (form) => {
    const saved = { ...form, id: Date.now() };
    setEvents((prev) => [...prev, saved]);
    setModalOpen(false);
  };
  const onUpdateEvent = (form) => {
    setEvents((prev) => prev.map((e) => (e.id === form.id ? form : e)));
    setModalOpen(false);
  };
  const onDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalOpen(false);
  };

  const eventPropGetter = (event) => {
    const color = event.color || "#8ab4f8";
    return {
      style: {
        background: color + "22",
        border: `1px solid ${color}AA`,
        color: "#1f1f1f",
        borderRadius: 6,
        padding: "2px 6px",
        fontSize: 12,
      },
    };
  };

  const components = useMemo(
    () => ({
      toolbar: () => null,
      week: { dateHeader: WeekDateHeader },
    }),
    []
  );

  const formats = useMemo(
    () => ({
      timeGutterFormat: (d) => moment(d).format("HH:mm"),
      dayFormat: (d) => moment(d).format("D일"),
    }),
    []
  );

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.pageWrap}>
      <style>{OVERLAY_SCROLLBAR_CSS}</style>

      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <button className={styles.brandBtn} onClick={goHome} aria-label="메인으로 이동">
            <img className={styles.logo} src={logoSvg} alt="로고" />
            <img className={styles.font} src={nameSvg} alt="품아이" />
          </button>
        </div>

        <MiniMonth value={date} onChange={setDate} />

        <div className={styles.calendarList}>
          <div className={styles.header}>
            <img className={styles.cal} src={dateSvg} alt="" />
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

        <div className={styles.calendarList}>
          <div className={styles.header}>
            <img className={styles.cal} src={dateSvg} alt="" />
            <div className={styles.sectionTitle}>내 일정</div>
          </div>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#ED8611" }} />
            내 일정
          </label>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.leftControls}>
            <button className={styles.topBtn} onClick={() => setDate(new Date())}>
              오늘
            </button>
            <div className={styles.titleMonth}>{formatWeekRange(date)}</div>
          </div>
          <div className={styles.rightControls}>
            <div className={styles.viewSwitch}>주</div>
          </div>
        </div>

        <div className={styles.calendarHolder} ref={holderRef}>
          {/* ✅ style에 width를 추가합니다. */}
          {isThisWeek && nowTop != null && nowLeft != null && (
            <div className={styles.nowLine} style={{ top: nowTop, left: nowLeft, width: nowWidth }}>
              <span className={styles.nowDot} />
            </div>
          )}

          <Calendar
            localizer={localizer}
            date={date}
            view="week"
            onNavigate={setDate}
            selectable
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={onSelectSlot}
            onSelectEvent={onSelectEvent}
            style={{ height: "calc(100vh - 112px)" }}
            min={new Date(1970, 0, 1, 0, 0)}
            max={new Date(1970, 0, 1, 23, 0)}
            components={components}
            eventPropGetter={eventPropGetter}
            formats={formats}
            drilldownView={null}
          />

          <div
            style={{
              position: "absolute",
              right: 4,
              top: ovTop,
              height: ovHeight,
              width: 10,
              opacity: sbVisible ? 1 : 0,
              transition: "opacity .18s linear",
              pointerEvents: "none",
            }}
          >
            <div
              onMouseDown={onThumbMouseDown}
              style={{
                position: "absolute",
                right: 0,
                top: thumbTop,
                width: 8,
                height: thumbH,
                borderRadius: 9999,
                background: "rgba(0,0,0,.28)",
                boxShadow: "0 0 1px rgba(0,0,0,.3)",
                pointerEvents: "auto",
                cursor: "grab",
              }}
              onMouseEnter={() => setSbVisible(true)}
            />
          </div>
        </div>
      </main>

      {modalOpen && (
        <ScheduleModal
          slot={slotForModal}
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
          onAdd={onAddEvent}
          onUpdate={onUpdateEvent}
          onDelete={onDeleteEvent}
        />
      )}
    </div>
  );
}