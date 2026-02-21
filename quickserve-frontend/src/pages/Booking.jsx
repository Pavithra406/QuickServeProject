import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qsb-root {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'Sora', sans-serif;
    color: #e2e8f0;
    display: flex; flex-direction: column;
    position: relative; overflow-x: hidden;
  }

  /* BG */
  .qsb-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none; z-index: 0;
  }
  .qsb-orb { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.2; pointer-events: none; z-index: 0; animation: orbDrift 14s ease-in-out infinite; }
  .qsb-orb-a { width: 480px; height: 480px; background: radial-gradient(circle,#6366f1,#312e81); top:-140px; right:-120px; }
  .qsb-orb-b { width: 320px; height: 320px; background: radial-gradient(circle,#06b6d4,#0e7490); bottom:-80px; left:-80px; animation-delay:-7s; }
  @keyframes orbDrift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-30px)} }

  /* NAVBAR */
  .qsb-nav {
    position: sticky; top: 0; z-index: 100; width: 100%;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 64px;
    background: rgba(10,10,15,0.88); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,0.15);
  }
  .qsb-nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .qsb-nav-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg,#6366f1,#06b6d4); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace; font-weight: 700; font-size: 16px; color: #fff;
    box-shadow: 0 4px 16px rgba(99,102,241,0.45);
  }
  .qsb-nav-brand { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.4px; }
  .qsb-nav-brand span { background: linear-gradient(90deg,#6366f1,#06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .qsb-back-btn {
    display: flex; align-items: center; gap: 7px;
    background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
    border-radius: 9px; color: #818cf8; font-size: 13px; font-weight: 600;
    font-family: 'Sora', sans-serif; padding: 7px 16px; cursor: pointer; transition: all 0.2s;
  }
  .qsb-back-btn:hover { background: rgba(99,102,241,0.22); color: #a5b4fc; }

  /* CONTENT */
  .qsb-content { position: relative; z-index: 1; flex: 1; display: flex; justify-content: center; padding: 52px 24px 72px; }
  .qsb-wrap { width: 100%; max-width: 640px; animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

  /* BREADCRUMB */
  .qsb-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #475569; margin-bottom: 28px; }
  .qsb-breadcrumb b { color: #818cf8; font-weight: 600; }

  /* SERVICE BANNER */
  .qsb-service-banner {
    background: rgba(15,15,28,0.9); border: 1px solid rgba(99,102,241,0.22);
    border-radius: 20px; padding: 28px 28px 24px; margin-bottom: 28px;
    display: flex; align-items: center; gap: 20px;
    backdrop-filter: blur(16px); position: relative; overflow: hidden;
  }
  .qsb-service-banner::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(99,102,241,0.08), transparent 60%); pointer-events: none; }
  .qsb-service-icon { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1)); border: 1px solid rgba(99,102,241,0.3); display: flex; align-items: center; justify-content: center; font-size: 30px; flex-shrink: 0; }
  .qsb-service-tag { display: inline-flex; align-items: center; gap: 5px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); border-radius: 99px; padding: 3px 10px; font-size: 11px; font-weight: 600; color: #818cf8; letter-spacing: 0.06em; margin-bottom: 8px; }
  .qsb-service-name { font-size: 22px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.5px; margin-bottom: 6px; }
  .qsb-service-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .qsb-service-meta-item { font-size: 12.5px; color: #64748b; display: flex; align-items: center; gap: 5px; }
  .qsb-service-meta-item svg { color: #6366f1; }

  /* STEPS */
  .qsb-steps { display: flex; align-items: center; gap: 0; margin-bottom: 32px; padding: 0 4px; }
  .qsb-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
  .qsb-step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; font-family: 'Space Mono', monospace; transition: all 0.3s; position: relative; z-index: 1; }
  .qsb-step-circle.done { background: linear-gradient(135deg,#6366f1,#4f46e5); color: #fff; box-shadow: 0 0 16px rgba(99,102,241,0.5); }
  .qsb-step-circle.active { background: linear-gradient(135deg,#6366f1,#06b6d4); color: #fff; box-shadow: 0 0 20px rgba(99,102,241,0.6); animation: stepPulse 2s ease-in-out infinite; }
  .qsb-step-circle.pending { background: rgba(30,30,50,0.8); border: 1px solid rgba(100,116,139,0.2); color: #475569; }
  @keyframes stepPulse { 0%,100%{box-shadow:0 0 16px rgba(99,102,241,0.5)} 50%{box-shadow:0 0 28px rgba(99,102,241,0.8)} }
  .qsb-step-label { font-size: 11px; color: #475569; font-weight: 500; text-align: center; }
  .qsb-step-label.active-label { color: #818cf8; font-weight: 600; }
  .qsb-step-line { flex: 1; height: 1px; margin: 0 -1px; background: rgba(100,116,139,0.2); position: relative; top: -12px; transition: background 0.4s; }
  .qsb-step-line.filled { background: rgba(99,102,241,0.4); }

  /* CARD */
  .qsb-card { background: rgba(15,15,25,0.88); border: 1px solid rgba(99,102,241,0.2); border-radius: 20px; padding: 36px; backdrop-filter: blur(20px); box-shadow: 0 0 40px rgba(99,102,241,0.1), 0 30px 60px rgba(0,0,0,0.4); }
  .qsb-card-title { font-size: 17px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.3px; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  .qsb-card-title-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.25); display: flex; align-items: center; justify-content: center; color: #818cf8; }

  /* FORM */
  .qsb-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .qsb-field { position: relative; }
  .qsb-field.full { grid-column: 1/-1; }
  .qsb-label { display: block; font-size: 11.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 7px; }
  .qsb-label .req { color: #6366f1; margin-left: 2px; }
  .qsb-input-wrap { position: relative; }
  .qsb-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #475569; pointer-events: none; transition: color 0.2s; }
  .qsb-input { width: 100%; background: rgba(20,20,38,0.8); border: 1px solid rgba(100,116,139,0.2); border-radius: 12px; padding: 12px 14px 12px 42px; color: #e2e8f0; font-size: 14px; font-family: 'Sora', sans-serif; transition: all 0.25s; outline: none; }
  .qsb-input::placeholder { color: #2d3748; }
  .qsb-input:focus { border-color: rgba(99,102,241,0.6); background: rgba(20,20,55,0.9); box-shadow: 0 0 0 3px rgba(99,102,241,0.13); }
  .qsb-field.focused .qsb-input-icon { color: #6366f1; }

  .qsb-textarea { width: 100%; background: rgba(20,20,38,0.8); border: 1px solid rgba(100,116,139,0.2); border-radius: 12px; padding: 12px 14px 12px 42px; color: #e2e8f0; font-size: 14px; font-family: 'Sora', sans-serif; resize: vertical; min-height: 110px; transition: all 0.25s; outline: none; line-height: 1.6; }
  .qsb-textarea::placeholder { color: #2d3748; }
  .qsb-textarea:focus { border-color: rgba(99,102,241,0.6); background: rgba(20,20,55,0.9); box-shadow: 0 0 0 3px rgba(99,102,241,0.13); }
  .qsb-textarea-icon { position: absolute; left: 14px; top: 14px; color: #475569; pointer-events: none; transition: color 0.2s; }
  .qsb-field.focused .qsb-textarea-icon { color: #6366f1; }
  .qsb-char-count { text-align: right; font-size: 11px; color: #334155; margin-top: 5px; }

  /* PRIORITY */
  .qsb-priority-group { display: flex; gap: 10px; margin-top: 7px; }
  .qsb-priority-opt { flex: 1; cursor: pointer; }
  .qsb-priority-opt input { display: none; }
  .qsb-priority-badge { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 8px; border-radius: 10px; border: 1px solid rgba(100,116,139,0.18); background: rgba(20,20,38,0.7); font-size: 12px; font-weight: 600; transition: all 0.2s; }
  .qsb-priority-badge:hover { border-color: rgba(99,102,241,0.3); }
  .qsb-priority-opt input:checked ~ .qsb-priority-badge { border-color: var(--pc); background: var(--pbg); box-shadow: 0 0 0 1px var(--pc); color: var(--pc); }
  .qsb-p-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--pc); }

  /* DIVIDER */
  .qsb-divider { height: 1px; background: rgba(100,116,139,0.12); margin: 28px 0; }

  /* SUMMARY */
  .qsb-summary { background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15); border-radius: 14px; padding: 18px 20px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; }
  .qsb-summary-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
  .qsb-summary-key { color: #64748b; }
  .qsb-summary-val { color: #cbd5e1; font-weight: 600; }
  .qsb-summary-val.highlight { background: linear-gradient(90deg,#6366f1,#06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  /* ALERTS */
  .qsb-alert { border-radius: 11px; padding: 13px 16px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; animation: alertIn 0.35s ease; }
  @keyframes alertIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .qsb-alert.success { background: rgba(34,197,94,0.09); border: 1px solid rgba(34,197,94,0.28); color: #86efac; }
  .qsb-alert.error { background: rgba(239,68,68,0.09); border: 1px solid rgba(239,68,68,0.28); color: #fca5a5; animation: shake 0.4s ease; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }

  /* SUBMIT */
  .qsb-submit { width: 100%; padding: 14px; border-radius: 13px; border: none; background: linear-gradient(135deg,#6366f1 0%,#4f46e5 50%,#06b6d4 100%); background-size: 200% 200%; color: #fff; font-size: 15px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; position: relative; overflow: hidden; transition: all 0.3s; box-shadow: 0 4px 24px rgba(99,102,241,0.4); animation: gradShift 4s ease infinite; }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .qsb-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.55); }
  .qsb-submit:active { transform: translateY(0); }
  .qsb-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
  .qsb-btn-shine { position: absolute; top:0; left:-100%; width:60%; height:100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); animation: shine 3s ease-in-out infinite; }
  @keyframes shine { from{left:-100%} to{left:200%} }
  .qsb-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* SUCCESS SCREEN */
  .qsb-success-screen { text-align: center; padding: 48px 32px; animation: slideUp 0.5s ease both; }
  .qsb-success-anim { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,rgba(34,197,94,0.2),rgba(6,182,212,0.1)); border: 2px solid rgba(34,197,94,0.4); display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 24px; animation: popIn 0.5s cubic-bezier(0.16,1,0.3,1) both; box-shadow: 0 0 40px rgba(34,197,94,0.25); }
  @keyframes popIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  .qsb-success-screen h2 { font-size: 24px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.5px; margin-bottom: 8px; }
  .qsb-success-screen p { font-size: 14px; color: #64748b; margin-bottom: 28px; }
  .qsb-success-ref { display: inline-block; font-family: 'Space Mono', monospace; font-size: 12px; color: #818cf8; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); border-radius: 8px; padding: 7px 16px; margin-bottom: 32px; letter-spacing: 0.08em; }
  .qsb-success-details { background: rgba(15,15,25,0.8); border: 1px solid rgba(100,116,139,0.15); border-radius: 14px; padding: 20px 24px; text-align: left; margin-bottom: 28px; display: flex; flex-direction: column; gap: 12px; }
  .qsb-success-row { display: flex; justify-content: space-between; font-size: 13px; }
  .qsb-success-row .k { color: #475569; }
  .qsb-success-row .v { color: #cbd5e1; font-weight: 600; }
  .qsb-redirect-bar { font-size: 12px; color: #475569; margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .qsb-progress-track { width: 120px; height: 3px; background: rgba(99,102,241,0.15); border-radius: 99px; overflow: hidden; }
  .qsb-progress-fill { height: 100%; background: linear-gradient(90deg,#6366f1,#06b6d4); border-radius: 99px; animation: progressFill 2s linear both; }
  @keyframes progressFill { from{width:0%} to{width:100%} }

  @media (max-width: 600px) {
    .qsb-nav { padding: 0 20px; }
    .qsb-content { padding: 32px 16px 64px; }
    .qsb-card { padding: 24px 20px; }
    .qsb-form-grid { grid-template-columns: 1fr; }
    .qsb-field.full { grid-column: 1; }
  }
`;

const SERVICE_META = {
  "House Cleaning":    { emoji: "🧹", category: "Home",     duration: "2–4 hrs",  price: "₹499+" },
  "Plumbing":          { emoji: "🔧", category: "Home",     duration: "1–3 hrs",  price: "₹349+" },
  "Electrical":        { emoji: "⚡", category: "Home",     duration: "1–2 hrs",  price: "₹399+" },
  "Gardening":         { emoji: "🌿", category: "Outdoor",  duration: "2–5 hrs",  price: "₹299+" },
  "Painting":          { emoji: "🎨", category: "Home",     duration: "4–8 hrs",  price: "₹799+" },
  "Carpentry":         { emoji: "🪚", category: "Home",     duration: "2–6 hrs",  price: "₹599+" },
  "Beauty & Spa":      { emoji: "💆", category: "Wellness", duration: "1–2 hrs",  price: "₹449+" },
  "Personal Training": { emoji: "🏋️", category: "Wellness", duration: "1 hr",     price: "₹599+" },
  "Wifi Setup":        { emoji: "📡", category: "Tech",     duration: "1–2 hrs",  price: "₹249+" },
  "Car Repair":        { emoji: "🚗", category: "Vehicle",  duration: "2–5 hrs",  price: "₹699+" },
};

const PRIORITY_OPTIONS = [
  { value: "LOW",    label: "Flexible",  emoji: "🕐", color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
  { value: "MEDIUM", label: "Standard",  emoji: "⚡", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  { value: "HIGH",   label: "Urgent",    emoji: "🔥", color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
];

function genRef() {
  return "QS-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default function Booking() {
  const location = useLocation();
  const navigate  = useNavigate();

  const serviceType   = location.state?.service;
  const customerEmail = localStorage.getItem("userEmail");

  const [name,        setName]        = useState("");
  const [place,       setPlace]       = useState("");
  const [timing,      setTiming]      = useState("");
  const [description, setDescription] = useState("");
  const [priority,    setPriority]    = useState("MEDIUM");
  const [phone,       setPhone]       = useState("");
  const [focused,     setFocused]     = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [booked,      setBooked]      = useState(false);
  const [bookingRef]                  = useState(genRef);

  // Guards
  if (!customerEmail) { navigate("/"); return null; }
  if (!serviceType)   { navigate("/dashboard"); return null; }

  const meta = SERVICE_META[serviceType] || { emoji: "🛠️", category: "Service", duration: "Varies", price: "On request" };
  const step = booked ? 3 : (name && place ? 2 : 1);

  const handleBooking = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!name || !place || !timing || !description) {
      setAlert({ type: "error", msg: "Please fill all required fields." });
      return;
    }
    if (phone && phone.length < 10) {
      setAlert({ type: "error", msg: "Please enter a valid phone number." });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/bookings/create", {
        customerEmail, serviceType, name, place, timing, description, priority, phone,
      });
      setBooked(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setAlert({ type: "error", msg: err.response?.data?.message || "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="qsb-root">
        <div className="qsb-grid" />
        <div className="qsb-orb qsb-orb-a" />
        <div className="qsb-orb qsb-orb-b" />

        {/* NAVBAR */}
        <nav className="qsb-nav">
          <div className="qsb-nav-logo" onClick={() => navigate("/dashboard")}>
            <div className="qsb-nav-icon">Q</div>
            <div className="qsb-nav-brand">Quick<span>Serve</span></div>
          </div>
          <button className="qsb-back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
        </nav>

        <div className="qsb-content">
          <div className="qsb-wrap">

            {/* BREADCRUMB */}
            <div className="qsb-breadcrumb">
              <span>Dashboard</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span>Services</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              <b>{serviceType}</b>
            </div>

            {/* SERVICE BANNER */}
            <div className="qsb-service-banner">
              <div className="qsb-service-icon">{meta.emoji}</div>
              <div style={{flex:1}}>
                <div className="qsb-service-tag">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
                  {meta.category}
                </div>
                <div className="qsb-service-name">{serviceType}</div>
                <div className="qsb-service-meta">
                  <div className="qsb-service-meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {meta.duration}
                  </div>
                  <div className="qsb-service-meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    {meta.price}
                  </div>
                  <div className="qsb-service-meta-item">⭐ 4.8 rating</div>
                </div>
              </div>
            </div>

            {/* PROGRESS STEPS */}
            <div className="qsb-steps">
              {["Your Info", "Schedule", "Confirm"].map((s, i) => {
                const n   = i + 1;
                const cls = booked ? "done" : n < step ? "done" : n === step ? "active" : "pending";
                return (
                  <>
                    <div className="qsb-step" key={s}>
                      <div className={`qsb-step-circle ${cls}`}>
                        {cls === "done"
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          : n}
                      </div>
                      <div className={`qsb-step-label ${cls === "active" ? "active-label" : ""}`}>{s}</div>
                    </div>
                    {i < 2 && <div className={`qsb-step-line ${n < step || booked ? "filled" : ""}`} key={`l${i}`} />}
                  </>
                );
              })}
            </div>

            {/* CARD */}
            <div className="qsb-card">
              {booked ? (
                <div className="qsb-success-screen">
                  <div className="qsb-success-anim">✓</div>
                  <h2>Booking Confirmed!</h2>
                  <p>A professional will reach out to you shortly.</p>
                  <div className="qsb-success-ref">Ref # {bookingRef}</div>
                  <div className="qsb-success-details">
                    {[
                      ["Service",  serviceType],
                      ["Name",     name || "—"],
                      ["Location", place || "—"],
                      ["Timing",   timing ? new Date(timing).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"],
                      ["Priority", PRIORITY_OPTIONS.find(p => p.value === priority)?.label],
                    ].map(([k, v]) => (
                      <div className="qsb-success-row" key={k}>
                        <span className="k">{k}</span>
                        <span className="v">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="qsb-redirect-bar">
                    <span>Redirecting to dashboard</span>
                    <div className="qsb-progress-track"><div className="qsb-progress-fill" /></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="qsb-card-title">
                    <div className="qsb-card-title-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                    </div>
                    Booking Details
                  </div>

                  {alert && (
                    <div className={`qsb-alert ${alert.type}`}>
                      {alert.type === "success"
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                      {alert.msg}
                    </div>
                  )}

                  <form onSubmit={handleBooking}>
                    <div className="qsb-form-grid">

                      {/* Full Name */}
                      <div className={`qsb-field ${focused === "name" ? "focused" : ""}`}>
                        <label className="qsb-label">Full Name <span className="req">*</span></label>
                        <div className="qsb-input-wrap">
                          <svg className="qsb-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <input className="qsb-input" type="text" placeholder="John Doe"
                            value={name} onChange={e => setName(e.target.value)}
                            onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} required />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className={`qsb-field ${focused === "phone" ? "focused" : ""}`}>
                        <label className="qsb-label">Phone Number</label>
                        <div className="qsb-input-wrap">
                          <svg className="qsb-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.17 2 2 0 012 .01h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 14.92z"/></svg>
                          <input className="qsb-input" type="tel" placeholder="+91 98765 43210"
                            value={phone} onChange={e => setPhone(e.target.value)}
                            onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                        </div>
                      </div>

                      {/* Location */}
                      <div className={`qsb-field ${focused === "place" ? "focused" : ""}`}>
                        <label className="qsb-label">Location / Address <span className="req">*</span></label>
                        <div className="qsb-input-wrap">
                          <svg className="qsb-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          <input className="qsb-input" type="text" placeholder="Street, City"
                            value={place} onChange={e => setPlace(e.target.value)}
                            onFocus={() => setFocused("place")} onBlur={() => setFocused(null)} required />
                        </div>
                      </div>

                      {/* Timing */}
                      <div className={`qsb-field ${focused === "timing" ? "focused" : ""}`}>
                        <label className="qsb-label">Preferred Date & Time <span className="req">*</span></label>
                        <div className="qsb-input-wrap">
                          <svg className="qsb-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          <input className="qsb-input" type="datetime-local"
                            value={timing} onChange={e => setTiming(e.target.value)}
                            onFocus={() => setFocused("timing")} onBlur={() => setFocused(null)}
                            required style={{ colorScheme: "dark" }} />
                        </div>
                      </div>

                      {/* Description */}
                      <div className={`qsb-field full ${focused === "desc" ? "focused" : ""}`}>
                        <label className="qsb-label">Work Description <span className="req">*</span></label>
                        <div className="qsb-input-wrap">
                          <svg className="qsb-textarea-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                          <textarea className="qsb-textarea"
                            placeholder="Describe the work you need done — the more detail, the better..."
                            value={description} onChange={e => setDescription(e.target.value)}
                            onFocus={() => setFocused("desc")} onBlur={() => setFocused(null)}
                            maxLength={400} required />
                        </div>
                        <div className="qsb-char-count">{description.length}/400</div>
                      </div>

                      {/* Priority */}
                      <div className="qsb-field full">
                        <label className="qsb-label">Service Priority</label>
                        <div className="qsb-priority-group">
                          {PRIORITY_OPTIONS.map(p => (
                            <label className="qsb-priority-opt" key={p.value}
                              style={{ "--pc": p.color, "--pbg": p.bg }}>
                              <input type="radio" name="priority" value={p.value}
                                checked={priority === p.value}
                                onChange={() => setPriority(p.value)} />
                              <div className="qsb-priority-badge">
                                <div className="qsb-p-dot" />
                                <span>{p.emoji}</span>
                                <span style={{ color: priority === p.value ? p.color : "#94a3b8" }}>{p.label}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className="qsb-divider" />

                    {/* SUMMARY */}
                    <div className="qsb-summary">
                      <div className="qsb-summary-row">
                        <span className="qsb-summary-key">Service</span>
                        <span className="qsb-summary-val highlight">{serviceType}</span>
                      </div>
                      <div className="qsb-summary-row">
                        <span className="qsb-summary-key">Booked by</span>
                        <span className="qsb-summary-val">{customerEmail}</span>
                      </div>
                      <div className="qsb-summary-row">
                        <span className="qsb-summary-key">Est. Duration</span>
                        <span className="qsb-summary-val">{meta.duration}</span>
                      </div>
                      <div className="qsb-summary-row">
                        <span className="qsb-summary-key">Starting From</span>
                        <span className="qsb-summary-val">{meta.price}</span>
                      </div>
                    </div>

                    <button className="qsb-submit" type="submit" disabled={loading}>
                      <span className="qsb-btn-shine" />
                      {loading
                        ? <><span className="qsb-spinner" />Processing Booking…</>
                        : "Confirm Booking →"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}