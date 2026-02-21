import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qsp-root {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'Sora', sans-serif;
    color: #e2e8f0;
    display: flex; flex-direction: column;
    position: relative;
  }

  /* BG */
  .qsp-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.045) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none; z-index: 0;
  }
  .qsp-orb {
    position: fixed; border-radius: 50%;
    filter: blur(100px); opacity: 0.18;
    pointer-events: none; z-index: 0;
  }
  .qsp-orb-a { width: 500px; height: 500px; background: radial-gradient(circle,#6366f1,#312e81); top:-160px; left:-120px; }
  .qsp-orb-b { width: 350px; height: 350px; background: radial-gradient(circle,#06b6d4,#0e7490); bottom:-80px; right:-80px; }

  /* NAVBAR */
  .qsp-nav {
    position: sticky; top: 0; z-index: 100;
    width: 100%;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 64px;
    background: rgba(10,10,15,0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,0.15);
  }
  .qsp-nav-logo { display: flex; align-items: center; gap: 10px; }
  .qsp-nav-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-weight: 700; font-size: 16px; color: #fff;
    box-shadow: 0 4px 16px rgba(99,102,241,0.4);
  }
  .qsp-nav-brand { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.4px; }
  .qsp-nav-brand span {
    background: linear-gradient(90deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .qsp-nav-right { display: flex; align-items: center; gap: 12px; }
  .qsp-nav-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 99px; padding: 4px 12px;
    font-size: 12px; color: #818cf8; font-weight: 600;
  }
  .qsp-nav-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px #22c55e;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .qsp-nav-email { font-size: 12.5px; color: #475569; font-family: 'Space Mono', monospace; }
  .qsp-logout {
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 8px; color: #818cf8;
    font-size: 13px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    padding: 7px 16px; cursor: pointer;
    transition: all 0.2s;
  }
  .qsp-logout:hover { background: rgba(99,102,241,0.22); color: #a5b4fc; }

  /* MAIN */
  .qsp-main {
    position: relative; z-index: 1;
    flex: 1; max-width: 1280px;
    width: 100%; margin: 0 auto;
    padding: 48px 40px 72px;
    animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* PAGE HEADER */
  .qsp-page-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 16px; margin-bottom: 36px;
  }
  .qsp-page-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.22);
    border-radius: 99px; padding: 4px 12px;
    font-size: 11px; font-weight: 600; color: #818cf8;
    letter-spacing: 0.06em; margin-bottom: 10px;
  }
  .qsp-page-tag-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #6366f1; box-shadow: 0 0 8px #6366f1;
    animation: blink 2s ease-in-out infinite;
  }
  .qsp-page-title {
    font-size: clamp(22px,3vw,30px);
    font-weight: 700; color: #f1f5f9;
    letter-spacing: -0.6px;
  }
  .qsp-page-title span {
    background: linear-gradient(90deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .qsp-page-sub { font-size: 14px; color: #64748b; margin-top: 4px; }

  /* REFRESH BTN */
  .qsp-refresh-btn {
    display: flex; align-items: center; gap: 7px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 10px; color: #818cf8;
    font-size: 13px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    padding: 9px 18px; cursor: pointer;
    transition: all 0.2s;
  }
  .qsp-refresh-btn:hover { background: rgba(99,102,241,0.22); transform: translateY(-1px); }
  .qsp-refresh-btn svg { transition: transform 0.4s; }
  .qsp-refresh-btn:hover svg { transform: rotate(180deg); }

  /* STATS ROW */
  .qsp-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 32px;
  }
  .qsp-stat-card {
    background: rgba(15,15,25,0.85);
    border: 1px solid rgba(100,116,139,0.15);
    border-radius: 16px; padding: 20px 22px;
    backdrop-filter: blur(14px);
    transition: all 0.25s;
    position: relative; overflow: hidden;
  }
  .qsp-stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--sc);
    opacity: 0.7;
  }
  .qsp-stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
  .qsp-stat-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; margin-bottom: 12px;
    background: var(--sbg);
    border: 1px solid var(--sborder);
  }
  .qsp-stat-num {
    font-size: 28px; font-weight: 700;
    color: #f1f5f9; letter-spacing: -0.5px;
    font-family: 'Space Mono', monospace;
  }
  .qsp-stat-label { font-size: 12px; color: #64748b; margin-top: 3px; }

  /* FILTERS */
  .qsp-filters {
    display: flex; align-items: center;
    gap: 10px; margin-bottom: 24px; flex-wrap: wrap;
  }
  .qsp-filter-label { font-size: 12.5px; color: #475569; font-weight: 600; margin-right: 4px; }
  .qsp-filter-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 99px;
    border: 1px solid rgba(100,116,139,0.2);
    background: rgba(20,20,38,0.7);
    color: #64748b; font-size: 13px; font-weight: 600;
    font-family: 'Sora', sans-serif; cursor: pointer;
    transition: all 0.2s;
  }
  .qsp-filter-btn:hover { border-color: rgba(99,102,241,0.35); color: #818cf8; }
  .qsp-filter-btn.active {
    border-color: var(--fc);
    background: var(--fbg);
    color: var(--fc);
    box-shadow: 0 0 0 1px var(--fc-s);
  }
  .qsp-filter-count {
    background: rgba(255,255,255,0.08);
    border-radius: 99px; padding: 1px 7px;
    font-size: 11px;
  }
  .qsp-search-wrap {
    margin-left: auto; position: relative;
  }
  .qsp-search-icon {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%);
    color: #475569; pointer-events: none;
  }
  .qsp-search-input {
    background: rgba(20,20,38,0.8);
    border: 1px solid rgba(100,116,139,0.2);
    border-radius: 10px;
    padding: 8px 14px 8px 36px;
    color: #e2e8f0; font-size: 13px;
    font-family: 'Sora', sans-serif;
    outline: none; width: 220px;
    transition: all 0.2s;
  }
  .qsp-search-input::placeholder { color: #2d3748; }
  .qsp-search-input:focus {
    border-color: rgba(99,102,241,0.5);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    width: 260px;
  }

  /* SECTION HEADER */
  .qsp-section-head {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 18px;
  }
  .qsp-section-title { font-size: 15px; font-weight: 700; color: #94a3b8; }
  .qsp-section-count {
    font-size: 11.5px; color: #475569;
    background: rgba(100,116,139,0.1);
    border-radius: 99px; padding: 2px 9px;
  }

  /* GRID */
  .qsp-bookings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  /* BOOKING CARD */
  .qsp-booking-card {
    background: rgba(15,15,25,0.88);
    border: 1px solid rgba(100,116,139,0.15);
    border-radius: 18px;
    overflow: hidden;
    backdrop-filter: blur(14px);
    transition: all 0.25s ease;
    animation: cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
    position: relative;
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(16px) scale(0.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  .qsp-booking-card:hover {
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.12);
  }
  .qsp-booking-card-top {
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(100,116,139,0.1);
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
  }
  .qsp-booking-service-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .qsp-booking-service-name {
    font-size: 15px; font-weight: 700;
    color: #f1f5f9; letter-spacing: -0.3px;
    margin-bottom: 3px;
  }
  .qsp-booking-id {
    font-size: 11px; color: #475569;
    font-family: 'Space Mono', monospace;
  }
  .qsp-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 99px;
    font-size: 11.5px; font-weight: 700;
    letter-spacing: 0.04em; flex-shrink: 0;
    border: 1px solid var(--bc);
    background: var(--bbg);
    color: var(--bc);
  }
  .qsp-status-pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--bc);
  }

  /* CARD BODY */
  .qsp-booking-card-body { padding: 16px 20px; }
  .qsp-booking-rows { display: flex; flex-direction: column; gap: 9px; margin-bottom: 14px; }
  .qsp-booking-row {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13px;
  }
  .qsp-booking-row-icon {
    width: 26px; height: 26px; border-radius: 7px;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.13);
    display: flex; align-items: center; justify-content: center;
    color: #6366f1; flex-shrink: 0; margin-top: 1px;
  }
  .qsp-booking-row-key { color: #475569; font-size: 11.5px; margin-bottom: 1px; }
  .qsp-booking-row-val { color: #cbd5e1; font-size: 13px; }

  /* PRIORITY TAG */
  .qsp-priority-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 99px;
    font-size: 11px; font-weight: 700;
    border: 1px solid var(--ptc);
    background: var(--ptbg); color: var(--ptc);
    margin-top: 2px;
  }

  /* DESCRIPTION */
  .qsp-desc {
    background: rgba(10,10,20,0.5);
    border: 1px solid rgba(100,116,139,0.1);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 12.5px; color: #64748b;
    line-height: 1.55; margin-bottom: 16px;
    font-style: italic;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ACTION BUTTONS */
  .qsp-actions { display: flex; gap: 10px; }
  .qsp-approve-btn, .qsp-reject-btn, .qsp-done-btn {
    flex: 1; padding: 10px 0;
    border-radius: 10px; border: none;
    font-size: 13px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .qsp-approve-btn {
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.3);
    color: #4ade80;
  }
  .qsp-approve-btn:hover {
    background: rgba(34,197,94,0.22);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(34,197,94,0.2);
  }
  .qsp-reject-btn {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    color: #f87171;
  }
  .qsp-reject-btn:hover {
    background: rgba(239,68,68,0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(239,68,68,0.2);
  }
  .qsp-done-btn {
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    color: #818cf8;
  }
  .qsp-done-btn:hover {
    background: rgba(99,102,241,0.2);
    transform: translateY(-1px);
  }
  .qsp-action-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* EMPTY */
  .qsp-empty {
    grid-column: 1/-1;
    display: flex; flex-direction: column; align-items: center;
    padding: 80px 0; gap: 14px;
  }
  .qsp-empty-icon { font-size: 52px; }
  .qsp-empty h3 { font-size: 18px; font-weight: 700; color: #475569; }
  .qsp-empty p { font-size: 14px; color: #334155; }

  /* LOADING SKELETON */
  .qsp-skeleton {
    background: rgba(15,15,25,0.8);
    border: 1px solid rgba(100,116,139,0.1);
    border-radius: 18px;
    overflow: hidden;
  }
  .qsp-skeleton-shimmer {
    height: 180px;
    background: linear-gradient(90deg, rgba(30,30,50,0.5) 25%, rgba(50,50,80,0.5) 50%, rgba(30,30,50,0.5) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

  /* TOAST */
  .qsp-toast-wrap {
    position: fixed; bottom: 28px; right: 28px;
    z-index: 999; display: flex; flex-direction: column; gap: 10px;
  }
  .qsp-toast {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px; border-radius: 12px;
    backdrop-filter: blur(20px);
    font-size: 13.5px; font-weight: 600;
    animation: toastIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
    max-width: 320px; box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateX(40px) scale(0.95); }
    to   { opacity:1; transform:translateX(0) scale(1); }
  }
  .qsp-toast.success {
    background: rgba(15,30,20,0.95);
    border: 1px solid rgba(34,197,94,0.35);
    color: #86efac;
  }
  .qsp-toast.error {
    background: rgba(30,10,10,0.95);
    border: 1px solid rgba(239,68,68,0.35);
    color: #fca5a5;
  }
  .qsp-toast.info {
    background: rgba(10,15,30,0.95);
    border: 1px solid rgba(99,102,241,0.35);
    color: #a5b4fc;
  }

  @media (max-width: 900px) {
    .qsp-stats { grid-template-columns: repeat(2,1fr); }
    .qsp-nav { padding: 0 20px; }
    .qsp-main { padding: 32px 20px 60px; }
    .qsp-nav-email { display: none; }
  }
  @media (max-width: 600px) {
    .qsp-stats { grid-template-columns: repeat(2,1fr); }
    .qsp-bookings-grid { grid-template-columns: 1fr; }
    .qsp-search-wrap { margin-left: 0; width: 100%; }
    .qsp-search-input { width: 100%; }
    .qsp-search-input:focus { width: 100%; }
    .qsp-filters { flex-direction: column; align-items: flex-start; }
  }
`;

const SERVICE_EMOJI = {
  "House Cleaning": "🧹", "Plumbing": "🔧", "Electrical": "⚡",
  "Gardening": "🌿", "Painting": "🎨", "Carpentry": "🪚",
  "Beauty & Spa": "💆", "Personal Training": "🏋️", "Wifi Setup": "📡", "Car Repair": "🚗",
};

const STATUS_STYLE = {
  PENDING:   { bc: "#f59e0b", bbg: "rgba(245,158,11,0.1)"  },
  APPROVED:  { bc: "#22c55e", bbg: "rgba(34,197,94,0.1)"   },
  REJECTED:  { bc: "#ef4444", bbg: "rgba(239,68,68,0.1)"   },
  COMPLETED: { bc: "#818cf8", bbg: "rgba(129,140,248,0.1)" },
};

const PRIORITY_STYLE = {
  LOW:    { ptc: "#22c55e", ptbg: "rgba(34,197,94,0.08)",   label: "🕐 Flexible" },
  MEDIUM: { ptc: "#f59e0b", ptbg: "rgba(245,158,11,0.08)",  label: "⚡ Standard" },
  HIGH:   { ptc: "#ef4444", ptbg: "rgba(239,68,68,0.08)",   label: "🔥 Urgent"   },
};

const FILTERS = [
  { key: "ALL",       label: "All",       fc: "#818cf8", fbg: "rgba(99,102,241,0.1)",   fc_s: "rgba(99,102,241,0.3)"  },
  { key: "PENDING",   label: "Pending",   fc: "#f59e0b", fbg: "rgba(245,158,11,0.08)",  fc_s: "rgba(245,158,11,0.3)"  },
  { key: "APPROVED",  label: "Approved",  fc: "#22c55e", fbg: "rgba(34,197,94,0.08)",   fc_s: "rgba(34,197,94,0.3)"   },
  { key: "REJECTED",  label: "Rejected",  fc: "#ef4444", fbg: "rgba(239,68,68,0.08)",   fc_s: "rgba(239,68,68,0.3)"   },
  { key: "COMPLETED", label: "Completed", fc: "#a78bfa", fbg: "rgba(167,139,250,0.08)", fc_s: "rgba(167,139,250,0.3)" },
];

let toastId = 0;

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const providerEmail = localStorage.getItem("userEmail") || "provider@quickserve.app";

  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("ALL");
  const [search, setSearch]         = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [toasts, setToasts]         = useState([]);

  useEffect(() => { fetchBookings(); }, []);

  const addToast = (msg, type = "success") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/bookings/all");
      setBookings(res.data);
    } catch {
      addToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(a => ({ ...a, [id]: status }));
    try {
      await axios.put(`http://localhost:8080/api/bookings/update-status/${id}?status=${status}`);
      setBookings(b => b.map(bk => bk.id === id ? { ...bk, status } : bk));
      addToast(
        status === "APPROVED"  ? "Booking approved successfully!" :
        status === "REJECTED"  ? "Booking has been rejected."     :
        status === "COMPLETED" ? "Booking marked as completed!"   : "Status updated",
        status === "REJECTED" ? "error" : "success"
      );
    } catch {
      addToast("Failed to update status", "error");
    } finally {
      setActionLoading(a => { const n={...a}; delete n[id]; return n; });
    }
  };

  const filtered = bookings.filter(b => {
    const matchFilter = filter === "ALL" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || [b.name, b.serviceType, b.customerEmail, b.place]
      .some(v => v?.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  const counts = {
    ALL: bookings.length,
    PENDING:   bookings.filter(b => b.status === "PENDING").length,
    APPROVED:  bookings.filter(b => b.status === "APPROVED").length,
    REJECTED:  bookings.filter(b => b.status === "REJECTED").length,
    COMPLETED: bookings.filter(b => b.status === "COMPLETED").length,
  };

  const stats = [
    { label: "Total Bookings", num: counts.ALL,       icon: "📋", sc: "#818cf8", sbg: "rgba(99,102,241,0.12)",  sborder: "rgba(99,102,241,0.25)" },
    { label: "Pending",        num: counts.PENDING,   icon: "⏳", sc: "#f59e0b", sbg: "rgba(245,158,11,0.1)",  sborder: "rgba(245,158,11,0.25)" },
    { label: "Approved",       num: counts.APPROVED,  icon: "✅", sc: "#22c55e", sbg: "rgba(34,197,94,0.1)",   sborder: "rgba(34,197,94,0.25)"  },
    { label: "Completed",      num: counts.COMPLETED, icon: "🏆", sc: "#a78bfa", sbg: "rgba(167,139,250,0.1)", sborder: "rgba(167,139,250,0.25)" },
  ];

  const formatDate = (str) => {
    if (!str) return "—";
    try { return new Date(str).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return str; }
  };

  return (
    <>
      <style>{css}</style>
      <div className="qsp-root">
        <div className="qsp-grid" />
        <div className="qsp-orb qsp-orb-a" />
        <div className="qsp-orb qsp-orb-b" />

        {/* NAVBAR */}
        <nav className="qsp-nav">
          <div className="qsp-nav-logo">
            <div className="qsp-nav-icon">Q</div>
            <div className="qsp-nav-brand">Quick<span>Serve</span></div>
          </div>
          <div className="qsp-nav-right">
            <div className="qsp-nav-badge">
              <div className="qsp-nav-dot" />
              Provider
            </div>
            <span className="qsp-nav-email">{providerEmail}</span>
            <button className="qsp-logout" onClick={() => { localStorage.clear(); navigate("/"); }}>
              Sign out
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="qsp-main">

          {/* PAGE HEADER */}
          <div className="qsp-page-header">
            <div>
              <div className="qsp-page-tag">
                <div className="qsp-page-tag-dot" />
                Provider Portal
              </div>
              <h1 className="qsp-page-title">Manage <span>Bookings</span></h1>
              <p className="qsp-page-sub">Review and respond to incoming service requests</p>
            </div>
            <button className="qsp-refresh-btn" onClick={fetchBookings}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              Refresh
            </button>
          </div>

          {/* STATS */}
          <div className="qsp-stats">
            {stats.map(s => (
              <div className="qsp-stat-card" key={s.label}
                style={{"--sc": s.sc, "--sbg": s.sbg, "--sborder": s.sborder}}>
                <div className="qsp-stat-icon">{s.icon}</div>
                <div className="qsp-stat-num">{loading ? "—" : s.num}</div>
                <div className="qsp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* FILTERS + SEARCH */}
          <div className="qsp-filters">
            <span className="qsp-filter-label">Filter:</span>
            {FILTERS.map(f => (
              <button key={f.key}
                className={`qsp-filter-btn ${filter === f.key ? "active" : ""}`}
                style={filter === f.key ? {"--fc":f.fc,"--fbg":f.fbg,"--fc-s":f.fc_s} : {}}
                onClick={() => setFilter(f.key)}>
                {f.label}
                <span className="qsp-filter-count">{counts[f.key] ?? 0}</span>
              </button>
            ))}
            <div className="qsp-search-wrap">
              <svg className="qsp-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="qsp-search-input" type="text"
                placeholder="Search bookings..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* SECTION HEAD */}
          <div className="qsp-section-head">
            <span className="qsp-section-title">
              {filter === "ALL" ? "All Requests" : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Requests`}
            </span>
            <span className="qsp-section-count">{filtered.length} shown</span>
          </div>

          {/* BOOKINGS GRID */}
          <div className="qsp-bookings-grid">
            {loading ? (
              [...Array(6)].map((_,i) => (
                <div className="qsp-skeleton" key={i} style={{animationDelay:`${i*0.07}s`}}>
                  <div className="qsp-skeleton-shimmer" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="qsp-empty">
                <div className="qsp-empty-icon">📭</div>
                <h3>{search ? "No results found" : "No bookings here"}</h3>
                <p>{search ? `No bookings match "${search}"` : "New requests will appear here."}</p>
              </div>
            ) : (
              filtered.map((b, idx) => {
                const ss = STATUS_STYLE[b.status] || STATUS_STYLE.PENDING;
                const ps = PRIORITY_STYLE[b.priority] || PRIORITY_STYLE.MEDIUM;
                const emoji = SERVICE_EMOJI[b.serviceType] || "🛠️";
                const isActing = actionLoading[b.id];
                return (
                  <div className="qsp-booking-card" key={b.id}
                    style={{animationDelay:`${idx*0.05}s`}}>

                    {/* TOP */}
                    <div className="qsp-booking-card-top">
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div className="qsp-booking-service-icon">{emoji}</div>
                        <div>
                          <div className="qsp-booking-service-name">{b.serviceType}</div>
                          <div className="qsp-booking-id">#{String(b.id).padStart(5,"0")}</div>
                        </div>
                      </div>
                      <div className="qsp-status-pill"
                        style={{"--bc":ss.bc,"--bbg":ss.bbg}}>
                        <div className="qsp-status-pill-dot" />
                        {b.status}
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="qsp-booking-card-body">
                      <div className="qsp-booking-rows">

                        <div className="qsp-booking-row">
                          <div className="qsp-booking-row-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                          <div>
                            <div className="qsp-booking-row-key">Customer</div>
                            <div className="qsp-booking-row-val">{b.name}</div>
                          </div>
                        </div>

                        <div className="qsp-booking-row">
                          <div className="qsp-booking-row-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          </div>
                          <div>
                            <div className="qsp-booking-row-key">Email</div>
                            <div className="qsp-booking-row-val">{b.customerEmail}</div>
                          </div>
                        </div>

                        <div className="qsp-booking-row">
                          <div className="qsp-booking-row-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                          <div>
                            <div className="qsp-booking-row-key">Location</div>
                            <div className="qsp-booking-row-val">{b.place}</div>
                          </div>
                        </div>

                        <div className="qsp-booking-row">
                          <div className="qsp-booking-row-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          </div>
                          <div>
                            <div className="qsp-booking-row-key">Scheduled</div>
                            <div className="qsp-booking-row-val">{formatDate(b.timing)}</div>
                          </div>
                        </div>

                        {b.priority && (
                          <div className="qsp-booking-row">
                            <div className="qsp-booking-row-icon">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            </div>
                            <div>
                              <div className="qsp-booking-row-key">Priority</div>
                              <div className="qsp-priority-tag"
                                style={{"--ptc":ps.ptc,"--ptbg":ps.ptbg}}>
                                {ps.label}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {b.description && (
                        <div className="qsp-desc">"{b.description}"</div>
                      )}

                      {/* ACTIONS */}
                      {b.status === "PENDING" && (
                        <div className="qsp-actions">
                          <button className="qsp-approve-btn"
                            onClick={() => updateStatus(b.id, "APPROVED")}
                            disabled={!!isActing}>
                            {isActing === "APPROVED"
                              ? <div className="qsp-action-spinner" />
                              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                            Approve
                          </button>
                          <button className="qsp-reject-btn"
                            onClick={() => updateStatus(b.id, "REJECTED")}
                            disabled={!!isActing}>
                            {isActing === "REJECTED"
                              ? <div className="qsp-action-spinner" />
                              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                            Reject
                          </button>
                        </div>
                      )}

                      {b.status === "APPROVED" && (
                        <div className="qsp-actions">
                          <button className="qsp-done-btn"
                            onClick={() => updateStatus(b.id, "COMPLETED")}
                            disabled={!!isActing}>
                            {isActing === "COMPLETED"
                              ? <div className="qsp-action-spinner" />
                              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                            Mark as Completed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* TOASTS */}
        <div className="qsp-toast-wrap">
          {toasts.map(t => (
            <div key={t.id} className={`qsp-toast ${t.type}`}>
              {t.type === "success" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              {t.type === "error"   && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              {t.type === "info"    && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}