import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.qs-dash {
  min-height: 100vh;
  background: #0a0a0f;
  font-family: 'Sora', sans-serif;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
}

/* ── GRID BG ── */
.qs-dash-bg {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none; z-index: 0;
}
.qs-orb { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.2; pointer-events: none; z-index: 0; }
.qs-orb-a { width: 500px; height: 500px; background: radial-gradient(circle,#6366f1,#312e81); top:-150px; left:-150px; }
.qs-orb-b { width: 350px; height: 350px; background: radial-gradient(circle,#06b6d4,#0e7490); bottom:-100px; right:-100px; }

/* ── NAVBAR ── */
.qs-nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 64px;
  background: rgba(10,10,15,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99,102,241,0.15);
}
.qs-nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.qs-nav-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg,#6366f1,#06b6d4);
  border-radius: 9px; display: flex; align-items: center; justify-content: center;
  font-family: 'Space Mono', monospace; font-weight: 700; font-size: 16px; color: #fff;
  box-shadow: 0 4px 16px rgba(99,102,241,0.45);
}
.qs-nav-brand { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.4px; }
.qs-nav-brand span { background: linear-gradient(90deg,#6366f1,#06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.qs-nav-right { display: flex; align-items: center; gap: 14px; }
.qs-nav-email { font-size: 12.5px; color: #64748b; font-family: 'Space Mono', monospace; }
.qs-nav-logout {
  background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);
  border-radius: 8px; color: #818cf8; font-size: 13px;
  font-family: 'Sora', sans-serif; font-weight: 600; padding: 7px 16px;
  cursor: pointer; transition: all 0.2s;
}
.qs-nav-logout:hover { background: rgba(99,102,241,0.25); color: #a5b4fc; }

/* ── MAIN ── */
.qs-main {
  position: relative; z-index: 1; flex: 1;
  max-width: 1200px; width: 100%; margin: 0 auto; padding: 48px 40px 64px;
}

/* ── HERO ── */
.qs-hero { margin-bottom: 48px; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
.qs-hero-tag {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
  border-radius: 99px; padding: 5px 14px;
  font-size: 12px; font-weight: 600; color: #818cf8; margin-bottom: 16px; letter-spacing: 0.04em;
}
.qs-hero-tag-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #6366f1; box-shadow: 0 0 8px #6366f1;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.8); } }
.qs-hero h1 { font-size: clamp(28px,4vw,40px); font-weight: 700; color: #f1f5f9; letter-spacing: -1px; line-height: 1.2; margin-bottom: 10px; }
.qs-hero h1 span { background: linear-gradient(90deg,#6366f1,#06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.qs-hero-sub { font-size: 15px; color: #64748b; max-width: 480px; }

/* ── SEARCH ── */
.qs-search-row {
  display: flex; gap: 12px; margin-bottom: 48px;
  animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.08s both;
}
.qs-search-wrap { position: relative; flex: 1; }
.qs-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #475569; pointer-events: none; }
.qs-search-input {
  width: 100%;
  background: rgba(20,20,35,0.8); border: 1px solid rgba(100,116,139,0.2);
  border-radius: 14px; padding: 14px 14px 14px 46px;
  color: #e2e8f0; font-size: 14.5px; font-family: 'Sora', sans-serif;
  transition: all 0.25s; outline: none;
}
.qs-search-input::placeholder { color: #334155; }
.qs-search-input:focus { border-color: rgba(99,102,241,0.55); background: rgba(20,20,50,0.9); box-shadow: 0 0 0 3px rgba(99,102,241,0.14); }
.qs-search-btn {
  background: linear-gradient(135deg,#6366f1,#4f46e5); border: none; border-radius: 14px;
  padding: 0 28px; color: #fff; font-size: 14px; font-weight: 600;
  font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4); white-space: nowrap;
}
.qs-search-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.55); }

/* ── SECTION HEADER ── */
.qs-section-head {
  display: flex; align-items: baseline; gap: 10px; margin-bottom: 24px;
  animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.12s both;
}
.qs-section-title { font-size: 18px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.3px; }
.qs-section-count { font-size: 12px; color: #475569; background: rgba(100,116,139,0.15); border-radius: 99px; padding: 2px 10px; }

/* ── GRID ── */
.qs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
  gap: 18px;
  animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.16s both;
}
.qs-empty { grid-column: 1/-1; text-align: center; padding: 60px 0; color: #475569; font-size: 15px; }
.qs-empty-icon { font-size: 40px; margin-bottom: 12px; }

/* ── CARD ── */
.qs-card {
  background: rgba(15,15,25,0.85); border: 1px solid rgba(100,116,139,0.15);
  border-radius: 18px; padding: 28px 22px 22px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 12px;
  cursor: pointer; transition: all 0.25s ease; position: relative; overflow: hidden;
  backdrop-filter: blur(12px);
}
.qs-card::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.06), transparent 60%);
  opacity: 0; transition: opacity 0.3s;
}
.qs-card:hover { border-color: rgba(99,102,241,0.45); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.15); }
.qs-card:hover::before { opacity: 1; }
.qs-card-emoji {
  width: 48px; height: 48px; border-radius: 12px;
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
  display: flex; align-items: center; justify-content: center; font-size: 22px;
  transition: background 0.2s;
}
.qs-card:hover .qs-card-emoji { background: rgba(99,102,241,0.2); }
.qs-card-name { font-size: 14.5px; font-weight: 600; color: #e2e8f0; letter-spacing: -0.2px; flex: 1; }
.qs-card-meta { font-size: 12px; color: #475569; }
.qs-card-btn {
  width: 100%; padding: 10px; border-radius: 10px;
  border: 1px solid rgba(99,102,241,0.3); background: rgba(99,102,241,0.1);
  color: #818cf8; font-size: 13px; font-weight: 600; font-family: 'Sora', sans-serif;
  cursor: pointer; transition: all 0.2s; margin-top: 4px;
}
.qs-card-btn:hover { background: rgba(99,102,241,0.25); border-color: rgba(99,102,241,0.6); color: #a5b4fc; transform: translateY(-1px); }

/* ── FEEDBACK SECTION ── */
.qs-feedback-section {
  margin-top: 64px;
  animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.2s both;
}
.qs-feedback-section .qs-section-head { margin-bottom: 28px; }

.qs-feedback-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* ── FEEDBACK CARD BASE ── */
.qs-feedback-card {
  background: rgba(15,15,28,0.9);
  border: 1px solid rgba(100,116,139,0.15);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}
.qs-feedback-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
.qs-rating-card::before {
  background: linear-gradient(90deg, #6366f1, #06b6d4);
}
.qs-complaint-card::before {
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.qs-feedback-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.3px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.qs-feedback-card-title-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
}
.qs-rating-icon-bg { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.25); }
.qs-complaint-icon-bg { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); }

.qs-feedback-card-sub {
  font-size: 12.5px;
  color: #475569;
  margin-bottom: 24px;
  padding-left: 44px;
}

/* Service selector */
.qs-select-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }
.qs-select {
  width: 100%;
  background: rgba(10,10,20,0.8);
  border: 1px solid rgba(100,116,139,0.2);
  border-radius: 10px;
  padding: 11px 14px;
  color: #cbd5e1;
  font-size: 13.5px;
  font-family: 'Sora', sans-serif;
  outline: none;
  margin-bottom: 20px;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23475569' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.qs-select:focus { border-color: rgba(99,102,241,0.5); }

/* ── STAR RATING ── */
.qs-stars-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }
.qs-stars {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
}
.qs-star {
  font-size: 30px;
  cursor: pointer;
  transition: transform 0.15s, filter 0.15s;
  filter: grayscale(1) brightness(0.4);
  line-height: 1;
}
.qs-star.active { filter: grayscale(0) brightness(1.1); }
.qs-star:hover { transform: scale(1.2); }

.qs-star-hint {
  font-size: 12px;
  color: #475569;
  margin-bottom: 18px;
  min-height: 16px;
  font-style: italic;
}

/* ── TEXTAREA ── */
.qs-textarea {
  width: 100%;
  background: rgba(10,10,20,0.8);
  border: 1px solid rgba(100,116,139,0.2);
  border-radius: 10px;
  padding: 12px 14px;
  color: #cbd5e1;
  font-size: 13.5px;
  font-family: 'Sora', sans-serif;
  resize: vertical;
  min-height: 90px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-bottom: 18px;
}
.qs-textarea::placeholder { color: #2d3748; }
.qs-textarea:focus { border-color: rgba(99,102,241,0.5); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.qs-complaint-card .qs-textarea:focus { border-color: rgba(239,68,68,0.4); box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }

/* ── SUBMIT BTN ── */
.qs-submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: 11px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: -0.2px;
}
.qs-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
.qs-rating-submit {
  background: linear-gradient(135deg,#6366f1,#4f46e5);
  color: #fff;
  box-shadow: 0 4px 18px rgba(99,102,241,0.4);
}
.qs-rating-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.55); }
.qs-complaint-submit {
  background: linear-gradient(135deg,#ef4444,#dc2626);
  color: #fff;
  box-shadow: 0 4px 18px rgba(239,68,68,0.3);
}
.qs-complaint-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(239,68,68,0.45); }

/* Complaint type pills */
.qs-complaint-types { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.qs-type-pill {
  padding: 5px 13px;
  border-radius: 99px;
  border: 1px solid rgba(100,116,139,0.2);
  background: rgba(20,20,35,0.8);
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Sora', sans-serif;
}
.qs-type-pill.active {
  border-color: rgba(239,68,68,0.5);
  background: rgba(239,68,68,0.12);
  color: #fca5a5;
}
.qs-type-pill:hover:not(.active) { border-color: rgba(100,116,139,0.4); color: #94a3b8; }

/* ── SUCCESS TOAST ── */
.qs-toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 9999;
  background: rgba(15,15,25,0.95);
  border: 1px solid rgba(99,102,241,0.4);
  border-radius: 14px;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
  animation: toastIn 0.4s cubic-bezier(0.16,1,0.3,1);
  max-width: 340px;
}
.qs-toast.complaint { border-color: rgba(239,68,68,0.4); }
@keyframes toastIn {
  from { opacity:0; transform: translateY(16px) scale(0.96); }
  to { opacity:1; transform: translateY(0) scale(1); }
}
.qs-toast-icon { font-size: 22px; }
.qs-toast-text strong { display: block; font-size: 14px; font-weight: 700; color: #f1f5f9; margin-bottom: 2px; }
.qs-toast-text span { font-size: 12.5px; color: #64748b; }

/* ── FOOTER ── */
.qs-footer {
  position: relative; z-index: 1;
  border-top: 1px solid rgba(99,102,241,0.12);
  background: rgba(8,8,14,0.95); backdrop-filter: blur(20px);
}
.qs-footer-inner { max-width: 1200px; margin: 0 auto; padding: 48px 40px 28px; }
.qs-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px; margin-bottom: 40px;
}
.qs-footer-brand p { font-size: 13.5px; color: #475569; line-height: 1.6; margin-top: 12px; max-width: 280px; }
.qs-footer-col h4 { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
.qs-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.qs-footer-col ul li a { font-size: 13.5px; color: #475569; text-decoration: none; transition: color 0.2s; }
.qs-footer-col ul li a:hover { color: #818cf8; }

.qs-contact-item { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 14px; }
.qs-contact-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: #818cf8;
}
.qs-contact-label { font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
.qs-contact-value { font-size: 13px; color: #94a3b8; }

.qs-footer-bottom {
  border-top: 1px solid rgba(100,116,139,0.1);
  padding-top: 24px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}
.qs-footer-copy { font-size: 12.5px; color: #334155; }
.qs-footer-copy span { color: #6366f1; font-family: 'Space Mono', monospace; }
.qs-footer-socials { display: flex; gap: 10px; }
.qs-social-btn {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
  display: flex; align-items: center; justify-content: center;
  color: #6366f1; text-decoration: none; font-size: 14px;
  transition: all 0.2s; cursor: pointer;
}
.qs-social-btn:hover { background: rgba(99,102,241,0.25); transform: translateY(-2px); color: #a5b4fc; }

@media (max-width: 768px) {
  .qs-nav { padding: 0 20px; }
  .qs-main { padding: 32px 20px 48px; }
  .qs-footer-inner { padding: 40px 20px 24px; }
  .qs-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .qs-footer-brand { grid-column: 1/-1; }
  .qs-feedback-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .qs-footer-grid { grid-template-columns: 1fr; }
}
`;

const SERVICES = [
  { name: "House Cleaning",   emoji: "🧹", category: "Home",     rating: "4.8" },
  { name: "Plumbing",         emoji: "🔧", category: "Home",     rating: "4.7" },
  { name: "Electrical",       emoji: "⚡", category: "Home",     rating: "4.9" },
  { name: "Gardening",        emoji: "🌿", category: "Outdoor",  rating: "4.6" },
  { name: "Painting",         emoji: "🎨", category: "Home",     rating: "4.8" },
  { name: "Carpentry",        emoji: "🪚", category: "Home",     rating: "4.7" },
  { name: "Beauty & Spa",     emoji: "💆", category: "Wellness", rating: "4.9" },
  { name: "Personal Training",emoji: "🏋️", category: "Wellness", rating: "4.8" },
  { name: "Wifi Setup",       emoji: "📡", category: "Tech",     rating: "4.7" },
  { name: "Car Repair",       emoji: "🚗", category: "Vehicle",  rating: "4.6" },
];

const STAR_HINTS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];
const COMPLAINT_TYPES = ["Late Arrival", "Poor Quality", "Rude Behavior", "Overcharging", "Damage Caused", "Other"];

function Toast({ message, type }) {
  return (
    <div className={`qs-toast${type === "complaint" ? " complaint" : ""}`}>
      <span className="qs-toast-icon">{type === "complaint" ? "⚠️" : "✅"}</span>
      <div className="qs-toast-text">
        <strong>{type === "complaint" ? "Complaint Submitted" : "Rating Submitted"}</strong>
        <span>{message}</span>
      </div>
    </div>
  );
}

function RatingCard({ userEmail, showToast }) {
  const [service, setService] = useState("");
  const [stars, setStars]     = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const active = hover || stars;

  const handleSubmit = async () => {
    if (!service) return alert("Please select a service.");
    if (!stars)   return alert("Please select a star rating.");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: "manual-entry",
          email:     userEmail,
          service:   service,
          stars:     stars,
          comment:   comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit rating");

      showToast(`Thanks for rating ${service}! (${stars}★)`, "rating");
      setService(""); setStars(0); setHover(0); setComment("");
    } catch (error) {
      console.error("Rating error:", error);
      alert("Error submitting rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qs-feedback-card qs-rating-card">
      <div className="qs-feedback-card-title">
        <div className="qs-feedback-card-title-icon qs-rating-icon-bg">⭐</div>
        Rate a Service
      </div>
      <p className="qs-feedback-card-sub">Share your experience with a completed booking.</p>

      <div className="qs-select-label">Service</div>
      <select className="qs-select" value={service} onChange={e => setService(e.target.value)}>
        <option value="">Choose a service…</option>
        {SERVICES.map(s => <option key={s.name} value={s.name}>{s.emoji} {s.name}</option>)}
      </select>

      <div className="qs-stars-label">Your Rating</div>
      <div className="qs-stars">
        {[1,2,3,4,5].map(n => (
          <span
            key={n}
            className={`qs-star${active >= n ? " active" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(n)}
          >★</span>
        ))}
      </div>
      <p className="qs-star-hint">{STAR_HINTS[active] || "Tap a star to rate"}</p>

      <div className="qs-select-label">Comment (optional)</div>
      <textarea
        className="qs-textarea"
        placeholder="Tell us what went well…"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
      />

      <button
        className="qs-submit-btn qs-rating-submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting…" : "Submit Rating →"}
      </button>
    </div>
  );
}

function ComplaintCard({ userEmail, showToast }) {
  const [service,     setService]     = useState("");
  const [type,        setType]        = useState("");
  const [description, setDescription] = useState("");
  const [loading,     setLoading]     = useState(false);

  const handleSubmit = async () => {
    if (!service)            return alert("Please select a service.");
    if (!type)               return alert("Please select a complaint type.");
    if (!description.trim()) return alert("Please describe your complaint.");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId:   "manual-entry",
          email:       userEmail,
          service:     service,
          type:        type,
          description: description,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit complaint");

      showToast(`Your complaint about ${service} has been logged.`, "complaint");
      setService(""); setType(""); setDescription("");
    } catch (error) {
      console.error("Complaint error:", error);
      alert("Error submitting complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qs-feedback-card qs-complaint-card">
      <div className="qs-feedback-card-title">
        <div className="qs-feedback-card-title-icon qs-complaint-icon-bg">🚨</div>
        File a Complaint
      </div>
      <p className="qs-feedback-card-sub">Had an issue? We take every concern seriously.</p>

      <div className="qs-select-label">Service</div>
      <select className="qs-select" value={service} onChange={e => setService(e.target.value)}>
        <option value="">Choose a service…</option>
        {SERVICES.map(s => <option key={s.name} value={s.name}>{s.emoji} {s.name}</option>)}
      </select>

      <div className="qs-select-label">Complaint Type</div>
      <div className="qs-complaint-types">
        {COMPLAINT_TYPES.map(t => (
          <button
            key={t}
            className={`qs-type-pill${type === t ? " active" : ""}`}
            onClick={() => setType(t)}
          >{t}</button>
        ))}
      </div>

      <div className="qs-select-label">Description</div>
      <textarea
        className="qs-textarea"
        placeholder="Describe what happened in detail…"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={4}
      />

      <button
        className="qs-submit-btn qs-complaint-submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting…" : "Submit Complaint →"}
      </button>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const userEmail = localStorage.getItem("userEmail") || "user@quickserve.app";

  const filtered = SERVICES.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBooking = (service) => navigate("/booking", { state: { service } });
  const handleLogout  = ()        => { localStorage.clear(); navigate("/"); };

  return (
    <>
      <style>{styles}</style>
      <div className="qs-dash">
        <div className="qs-dash-bg" />
        <div className="qs-orb qs-orb-a" />
        <div className="qs-orb qs-orb-b" />

        {/* NAVBAR */}
        <nav className="qs-nav">
          <a className="qs-nav-logo" href="/">
            <div className="qs-nav-icon">Q</div>
            <span className="qs-nav-brand">Quick<span>Serve</span></span>
          </a>
          <div className="qs-nav-right">
            <span className="qs-nav-email">{userEmail}</span>
            <button className="qs-nav-logout" onClick={handleLogout}>Sign out</button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="qs-main">

          {/* HERO */}
          <div className="qs-hero">
            <div className="qs-hero-tag">
              <div className="qs-hero-tag-dot" />
              Services available now
            </div>
            <h1>What can we help<br />with <span>today?</span></h1>
            <p className="qs-hero-sub">Browse trusted professionals for every home, wellness, and tech need.</p>
          </div>

          {/* SEARCH */}
          <div className="qs-search-row">
            <div className="qs-search-wrap">
              <svg className="qs-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                className="qs-search-input"
                placeholder="Search services or categories…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button className="qs-search-btn">Search</button>
          </div>

          {/* SERVICES GRID */}
          <div className="qs-section-head">
            <span className="qs-section-title">All Services</span>
            <span className="qs-section-count">{filtered.length} available</span>
          </div>
          <div className="qs-grid">
            {filtered.length === 0 ? (
              <div className="qs-empty">
                <div className="qs-empty-icon">🔍</div>
                No services found for "{query}"
              </div>
            ) : (
              filtered.map((s) => (
                <div key={s.name} className="qs-card" onClick={() => handleBooking(s.name)}>
                  <div className="qs-card-emoji">{s.emoji}</div>
                  <span className="qs-card-name">{s.name}</span>
                  <span className="qs-card-meta">⭐ {s.rating} · {s.category}</span>
                  <button
                    className="qs-card-btn"
                    onClick={e => { e.stopPropagation(); handleBooking(s.name); }}
                  >Book Now →</button>
                </div>
              ))
            )}
          </div>

          {/* RATING & COMPLAINT */}
          <section className="qs-feedback-section">
            <div className="qs-section-head">
              <span className="qs-section-title">Ratings &amp; Complaints</span>
              <span className="qs-section-count">Your voice matters</span>
            </div>
            <div className="qs-feedback-grid">
              <RatingCard   userEmail={userEmail} showToast={showToast} />
              <ComplaintCard userEmail={userEmail} showToast={showToast} />
            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="qs-footer">
          <div className="qs-footer-inner">
            <div className="qs-footer-grid">
              <div className="qs-footer-brand">
                <a className="qs-nav-logo" href="/">
                  <div className="qs-nav-icon">Q</div>
                  <span className="qs-nav-brand">Quick<span>Serve</span></span>
                </a>
                <p>Your trusted platform for booking local professionals. Fast, reliable, and always nearby.</p>
              </div>
              <div className="qs-footer-col">
                <h4>Services</h4>
                <ul>
                  {["House Cleaning","Plumbing","Electrical","Gardening","Beauty & Spa"].map(s => (
                    <li key={s}><a href="#">{s}</a></li>
                  ))}
                </ul>
              </div>
              <div className="qs-footer-col">
                <h4>Company</h4>
                <ul>
                  {["About Us","Careers","Blog","Press","Privacy Policy"].map(s => (
                    <li key={s}><a href="#">{s}</a></li>
                  ))}
                </ul>
              </div>
              <div className="qs-footer-col">
                <h4>Contact Us</h4>
                <div className="qs-contact-item">
                  <div className="qs-contact-icon">✉</div>
                  <div>
                    <div className="qs-contact-label">Email</div>
                    <div className="qs-contact-value">support@quickserve.app</div>
                  </div>
                </div>
                <div className="qs-contact-item">
                  <div className="qs-contact-icon">📞</div>
                  <div>
                    <div className="qs-contact-label">Phone</div>
                    <div className="qs-contact-value">+91 98765 43210</div>
                  </div>
                </div>
                <div className="qs-contact-item">
                  <div className="qs-contact-icon">📍</div>
                  <div>
                    <div className="qs-contact-label">Address</div>
                    <div className="qs-contact-value">12 Tech Park, Madurai, TN 625001</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="qs-footer-bottom">
              <p className="qs-footer-copy">
                © 2025 <span>QuickServe</span>. Built with ♥ for local communities.
              </p>
              <div className="qs-footer-socials">
                <a className="qs-social-btn" href="#" title="Twitter/X">𝕏</a>
                <a className="qs-social-btn" href="#" title="Instagram">◈</a>
                <a className="qs-social-btn" href="#" title="LinkedIn">in</a>
              </div>
            </div>
          </div>
        </footer>

        {/* TOAST */}
        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  );
}

export default Dashboard;