// src/pages/points/PointsPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../component/main/TopBar";
import BottomFooter from "../../component/main/BottomFooter";
import api, { getToken } from "../../lib/api";

/* ============================
 * 유틸
 * ============================ */

// yyyy.MM.dd (줄바꿈 방지)
const fmtDate = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
};

const reasonLabel = (code) =>
  (code || "").replace(/_/g, " ").toLowerCase() || "-";

// 서버가 여러 포맷으로 보낼 수 있으니 타입 정규화
function normalizeType(v) {
  if (v == null) return null;
  const s = String(v).trim().toUpperCase();
  if (s.startsWith("EARN") || s === "적립") return "EARN";
  if (s.startsWith("SPEND") || s === "사용") return "SPEND";
  return s;
}

/* ============================
 * Component
 * ============================ */
export default function PointsPage() {
  const navigate = useNavigate();

  // 탭 클릭 시 이동 (TopBar -> MainNavBar에서 호출)
  const goTab = useCallback(
    (t) => {
      switch (t) {
        case "홈":
          navigate("/");
          break;
        case "캘린더":
          navigate("/scheduleMonth"); // 필요시 /schedule
          break;
        case "커뮤니티":
          navigate("/community");
          break;
        case "스토어":
          navigate("/store");
          break;
        case "우편함":
          navigate("/inbox");
          break;
        default:
          navigate("/");
      }
    },
    [navigate]
  );

  const topBarProps = {
    activeTab: "홈",
    onChangeTab: goTab,
    onCalendarClick: () => navigate("/scheduleMonth"),
  };

  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);

  const [balance, setBalance] = useState(0);

  const [tab, setTab] = useState("전체"); // 전체/적립/사용
  const [page, setPage] = useState(0);
  const size = 20;

  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  /* ----- Fetchers (게시글 상세 페이지와 동일한 레이아웃 흐름) ----- */
  const fetchAll = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setNeedLogin(true);
      setRows([]);
      setLoading(false);
      return;
    }

    let alive = true;
    try {
      setLoading(true);

      // 1) 잔액
      const balRes = await api.get("/api/points/me");
      const bal = balRes?.data?.balance ?? 0;
      if (!alive) return;
      setBalance(Number(bal) || 0);

      // 2) 거래내역 (페이지네이션)
      const txRes = await api.get("/api/points/me/transactions", {
        params: { page, size },
      });
      const data = txRes?.data ?? {};
      const list = Array.isArray(data)
        ? data
        : data.content ?? data.items ?? data.transactions ?? [];

      if (!alive) return;
      // 타입 정규화 필드 추가
      const norm = (list || []).map((r) => ({
        ...r,
        _type: normalizeType(r?.type),
      }));

      setRows(norm);
      setTotalElements(
        Number(data.totalElements ?? data.total ?? norm?.length ?? 0)
      );
    } catch (e) {
      console.error("포인트 데이터 조회 실패:", e);
      if (e?.response?.status === 401) {
        setNeedLogin(true);
        setRows([]);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      alive = false;
    };
  }, [page, size]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ----- 계산값 ----- */

  // 탭 필터 (정규화된 _type 사용)
  const filtered = useMemo(() => {
    if (tab === "적립") return rows.filter((r) => r._type === "EARN");
    if (tab === "사용") return rows.filter((r) => r._type === "SPEND");
    return rows;
  }, [rows, tab]);

  // 합계는 항상 전체(rows) 기준
  const earnTotalAll = useMemo(
    () =>
      rows
        .filter((r) => r._type === "EARN")
        .reduce((s, r) => s + Number(r?.amount ?? 0), 0),
    [rows]
  );
  const spendTotalAll = useMemo(
    () =>
      rows
        .filter((r) => r._type === "SPEND")
        .reduce((s, r) => s + Number(r?.amount ?? 0), 0),
    [rows]
  );

  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  /* ============================
   * 렌더 (게시글 상세와 동일한 컨테이너/카드 스타일)
   * ============================ */

  if (needLogin) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
        <TopBar {...topBarProps} />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="max-w-5xl md:max-w-6xl mx-auto p-8">
            <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-10 text-center">
              포인트 내역은 로그인 후 확인할 수 있어요.
            </div>
          </div>
        </main>
        <BottomFooter />
      </div>
    );
  }

  if (loading && rows.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
        <TopBar {...topBarProps} />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="max-w-5xl md:max-w-6xl mx-auto p-8">불러오는 중...</div>
        </main>
        <BottomFooter />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <TopBar {...topBarProps} />

      <main className="flex-1 flex flex-col min-h-0">
        <div className="max-w-5xl md:max-w-6xl mx-auto p-4 md:p-8">
          <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-10">
            <h2 className="text-3xl font-bold mb-6">포인트 내역</h2>

            {/* 상단 카드 (항상 노출) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-gray-500 text-sm">현재 잔액</div>
                <div className="text-2xl font-bold mt-1">
                  {Number(balance).toLocaleString("ko-KR")}{" "}
                  <span className="text-base">온정</span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-gray-500 text-sm">적립 합계</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">
                  +{Number(earnTotalAll).toLocaleString("ko-KR")}{" "}
                  <span className="text-base text-gray-700">온정</span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-gray-500 text-sm">사용 합계</div>
                <div className="text-2xl font-bold text-red-600 mt-1">
                  -{Number(spendTotalAll).toLocaleString("ko-KR")}{" "}
                  <span className="text-base text-gray-700">온정</span>
                </div>
              </div>
            </div>

            {/* 탭 (버튼은 반드시 type="button") */}
            <div className="flex items-center gap-2 mb-4">
              {["전체", "적립", "사용"].map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    aria-pressed={active}
                    className={`px-3 py-1 rounded-md border text-sm ${
                      active
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* 표 */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[16%]" /> {/* 날짜 */}
                  <col className="w-[10%]" /> {/* 구분 */}
                  <col className="w-[22%]" /> {/* 사유 */}
                  <col className="w-[32%]" /> {/* 상세 */}
                  <col className="w-[12%]" /> {/* 변동 */}
                  <col className="w-[8%]" />  {/* 비고 */}
                </colgroup>

                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="py-2 px-3 text-left">날짜</th>
                    <th className="py-2 px-3 text-left">구분</th>
                    <th className="py-2 px-3 text-left">사유</th>
                    <th className="py-2 px-3 text-left">상세</th>
                    <th className="py-2 px-3 text-right">변동</th>
                    <th className="py-2 px-3 text-left">비고</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-gray-400">
                        불러오는 중…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-gray-400">
                        내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => {
                      const isEarn = r._type === "EARN";
                      const amt = Number(r?.amount ?? 0);
                      const detail = r?.refType
                        ? `${r.refType}${r.refId ? ` #${r.refId}` : ""}`
                        : "—";
                      return (
                        <tr key={r.id} className="border-t border-gray-100">
                          <td className="py-2 px-3 whitespace-nowrap">
                            {fmtDate(r?.createdAt)}
                          </td>

                          <td className="py-2 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                isEarn
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {isEarn ? "적립" : "사용"}
                            </span>
                          </td>

                          <td className="py-2 px-3 whitespace-nowrap">
                            <div className="truncate" title={reasonLabel(r?.reasonCode)}>
                              {reasonLabel(r?.reasonCode)}
                            </div>
                          </td>

                          <td className="py-2 px-3 whitespace-nowrap">
                            <div className="truncate" title={detail}>
                              {detail}
                            </div>
                          </td>

                          <td
                            className={`py-2 px-3 text-right font-semibold whitespace-nowrap ${
                              isEarn ? "text-emerald-600" : "text-red-600"
                            } font-mono`}
                          >
                            {isEarn ? "+" : "-"}
                            {amt.toLocaleString("ko-KR")}
                          </td>

                          <td className="py-2 px-3 whitespace-nowrap text-gray-500">—</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0 || loading}
              >
                이전
              </button>
              <div className="text-sm text-gray-600">
                {page + 1} / {totalPages}
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}
