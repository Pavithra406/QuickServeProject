import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qs-signup-root {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 32px 16px;
  }

  .qs-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: gridShift 20s linear infinite;
  }
  @keyframes gridShift {
    from { transform: translateY(0); }
    to { transform: translateY(48px); }
  }

  .qs-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
    animation: orbFloat 12s ease-in-out infinite;
  }
  .qs-orb-1 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #6366f1, #312e81);
    top: -120px; right: -80px;
    animation-delay: 0s;
  }
  .qs-orb-2 {
    width: 320px; height: 320px;
    background: radial-gradient(circle, #06b6d4, #0e7490);
    bottom: -80px; left: -80px;
    animation-delay: -5s;
  }
  .qs-orb-3 {
    width: 180px; height: 180px;
    background: radial-gradient(circle, #a78bfa, #7c3aed);
    top: 40%; left: 15%;
    animation-delay: -9s;
  }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -30px) scale(1.05); }
    66% { transform: translate(-15px, 20px) scale(0.95); }
  }

  .qs-particle {
    position: absolute;
    border-radius: 50%;
    animation: particleFloat linear infinite;
    opacity: 0;
  }
  @keyframes particleFloat {
    0% { transform: translateY(100vh) scale(0); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.4; }
    100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
  }

  /* Card */
  .qs-card {
    position: relative;
    z-index: 10;
    width: 440px;
    max-width: 100%;
    background: rgba(15, 15, 25, 0.85);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 24px;
    padding: 44px 40px;
    backdrop-filter: blur(24px);
    box-shadow: 0 0 60px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.5);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  @keyframes cardIn {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Logo */
  .qs-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  .qs-logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 18px;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(99,102,241,0.5);
  }
  .qs-logo-text {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
  }
  .qs-logo-text span {
    background: linear-gradient(90deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .qs-heading {
    font-size: 24px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }
  .qs-subheading {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 28px;
  }

  /* Alerts */
  .qs-error, .qs-success {
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: shakeIn 0.4s ease;
  }
  .qs-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    color: #fca5a5;
  }
  .qs-success {
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.3);
    color: #86efac;
    animation: none;
  }
  @keyframes shakeIn {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
  }

  /* Fields */
  .qs-field {
    margin-bottom: 16px;
    position: relative;
  }
  .qs-label {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 7px;
  }
  .qs-input-wrap { position: relative; }
  .qs-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
    transition: color 0.2s;
  }
  .qs-input {
    width: 100%;
    background: rgba(30, 30, 50, 0.7);
    border: 1px solid rgba(100, 116, 139, 0.2);
    border-radius: 12px;
    padding: 13px 14px 13px 42px;
    color: #e2e8f0;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    transition: all 0.25s ease;
    outline: none;
  }
  .qs-input::placeholder { color: #334155; }
  .qs-input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(30, 30, 60, 0.8);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.08);
  }
  .qs-input-focused .qs-input-icon { color: #6366f1; }

  .qs-pw-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #475569;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  .qs-pw-toggle:hover { color: #6366f1; }

  /* Password strength */
  .qs-strength {
    margin-top: 8px;
  }
  .qs-strength-bars {
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
  }
  .qs-strength-bar {
    height: 3px;
    flex: 1;
    border-radius: 99px;
    background: rgba(100,116,139,0.2);
    transition: background 0.3s ease;
  }
  .qs-strength-bar.weak { background: #ef4444; }
  .qs-strength-bar.fair { background: #f59e0b; }
  .qs-strength-bar.good { background: #22c55e; }
  .qs-strength-bar.strong { background: #6366f1; }
  .qs-strength-label {
    font-size: 11px;
    color: #64748b;
    transition: color 0.3s;
  }
  .qs-strength-label.weak { color: #ef4444; }
  .qs-strength-label.fair { color: #f59e0b; }
  .qs-strength-label.good { color: #22c55e; }
  .qs-strength-label.strong { color: #818cf8; }

  /* Role selector */
  .qs-role-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 7px;
  }
  .qs-role-option {
    position: relative;
    cursor: pointer;
  }
  .qs-role-option input {
    position: absolute;
    opacity: 0;
    width: 0; height: 0;
  }
  .qs-role-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    border-radius: 12px;
    border: 1px solid rgba(100,116,139,0.2);
    background: rgba(30, 30, 50, 0.6);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .qs-role-card:hover {
    border-color: rgba(99,102,241,0.4);
    background: rgba(30, 30, 60, 0.7);
  }
  .qs-role-option input:checked ~ .qs-role-card {
    border-color: #6366f1;
    background: rgba(99,102,241,0.12);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.1);
  }
  .qs-role-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    background: rgba(99,102,241,0.1);
    transition: background 0.2s;
  }
  .qs-role-option input:checked ~ .qs-role-card .qs-role-icon {
    background: rgba(99,102,241,0.25);
  }
  .qs-role-name {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    transition: color 0.2s;
  }
  .qs-role-option input:checked ~ .qs-role-card .qs-role-name {
    color: #a5b4fc;
  }
  .qs-role-desc {
    font-size: 11px;
    color: #475569;
    text-align: center;
    line-height: 1.4;
  }

  /* Submit */
  .qs-btn {
    width: 100%;
    margin-top: 10px;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%);
    background-size: 200% 200%;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(99,102,241,0.4);
    animation: gradientShift 4s ease infinite;
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .qs-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.55);
  }
  .qs-btn:active { transform: translateY(0); }
  .qs-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .qs-btn-shine {
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: btnShine 3s ease-in-out infinite;
  }
  @keyframes btnShine {
    from { left: -100%; }
    to { left: 200%; }
  }

  .qs-spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .qs-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0;
    color: #334155;
    font-size: 12px;
  }
  .qs-divider::before, .qs-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(100,116,139,0.2);
  }

  .qs-footer {
    text-align: center;
    font-size: 13.5px;
    color: #475569;
    margin-top: 18px;
  }
  .qs-footer a {
    color: #818cf8;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  .qs-footer a:hover { color: #a5b4fc; }

  /* Password match indicator */
  .qs-match {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    margin-top: 7px;
    transition: all 0.2s;
  }
  .qs-match.matched { color: #22c55e; }
  .qs-match.unmatched { color: #ef4444; }
`;

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthMeta = [
  { label: "", className: "" },
  { label: "Weak", className: "weak" },
  { label: "Fair", className: "fair" },
  { label: "Good", className: "good" },
  { label: "Strong", className: "strong" },
];

function SignupParticles() {
  return (
    <>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="qs-particle"
          style={{
            left: `${8 + i * 8}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 2 === 0 ? '#6366f1' : '#06b6d4',
            animationDuration: `${6 + (i % 5) * 2}s`,
            animationDelay: `${(i * 0.7) % 6}s`,
          }}
        />
      ))}
    </>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", role: "CUSTOMER" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const strength = getStrength(form.password);
  const meta = strengthMeta[strength];
  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1800);
    } catch {
      setError("Registration failed. This email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="qs-signup-root">
        <div className="qs-grid" />
        <div className="qs-orb qs-orb-1" />
        <div className="qs-orb qs-orb-2" />
        <div className="qs-orb qs-orb-3" />
        <SignupParticles />

        <div className="qs-card">
          <div className="qs-logo">
            <div className="qs-logo-icon">Q</div>
            <div className="qs-logo-text">Quick<span>Serve</span></div>
          </div>

          <h2 className="qs-heading">Create your account ✨</h2>
          <p className="qs-subheading">Join thousands of users on QuickServe</p>

          {error && (
            <div className="qs-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="qs-success">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Account created! Redirecting you to login…
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Email */}
            <div className={`qs-field ${focused === 'email' ? 'qs-input-focused' : ''}`}>
              <label className="qs-label">Email Address</label>
              <div className="qs-input-wrap">
                <svg className="qs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input className="qs-input" type="email" name="email" placeholder="you@example.com"
                  onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required />
              </div>
            </div>

            {/* Password */}
            <div className={`qs-field ${focused === 'password' ? 'qs-input-focused' : ''}`}>
              <label className="qs-label">Password</label>
              <div className="qs-input-wrap">
                <svg className="qs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input className="qs-input" type={showPw ? "text" : "password"} name="password"
                  placeholder="Create a strong password" onChange={handleChange}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} required />
                <button type="button" className="qs-pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                  {showPw
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <div className="qs-strength">
                  <div className="qs-strength-bars">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className={`qs-strength-bar ${strength >= n ? meta.className : ''}`} />
                    ))}
                  </div>
                  <div className={`qs-strength-label ${meta.className}`}>{meta.label} password</div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={`qs-field ${focused === 'confirmPassword' ? 'qs-input-focused' : ''}`}>
              <label className="qs-label">Confirm Password</label>
              <div className="qs-input-wrap">
                <svg className="qs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <input className="qs-input" type={showConfirmPw ? "text" : "password"} name="confirmPassword"
                  placeholder="Repeat your password" onChange={handleChange}
                  onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused(null)} required />
                <button type="button" className="qs-pw-toggle" onClick={() => setShowConfirmPw(v => !v)} tabIndex={-1}>
                  {showConfirmPw
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {passwordsMatch && (
                <div className="qs-match matched">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Passwords match
                </div>
              )}
              {passwordsMismatch && (
                <div className="qs-match unmatched">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Passwords don't match
                </div>
              )}
            </div>

            {/* Role selector */}
            <div className="qs-field">
              <label className="qs-label">I am joining as</label>
              <div className="qs-role-group">
                <label className="qs-role-option">
                  <input type="radio" name="role" value="CUSTOMER" checked={form.role === "CUSTOMER"} onChange={handleChange} />
                  <div className="qs-role-card">
                    <div className="qs-role-icon">🛍️</div>
                    <div className="qs-role-name">Customer</div>
                    <div className="qs-role-desc">Browse & book services</div>
                  </div>
                </label>
                <label className="qs-role-option">
                  <input type="radio" name="role" value="PROVIDER" checked={form.role === "PROVIDER"} onChange={handleChange} />
                  <div className="qs-role-card">
                    <div className="qs-role-icon">🔧</div>
                    <div className="qs-role-name">Provider</div>
                    <div className="qs-role-desc">Offer your services</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="qs-btn" disabled={loading || success}>
              <span className="qs-btn-shine" />
              {loading ? (
                <><span className="qs-spinner" /> Creating account…</>
              ) : success ? (
                "✓ Account Created!"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div className="qs-divider">or</div>

          <p className="qs-footer">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;