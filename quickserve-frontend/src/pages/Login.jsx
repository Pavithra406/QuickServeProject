import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qs-login-root {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Animated background grid */
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

  /* Floating orbs */
  .qs-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    animation: orbFloat 12s ease-in-out infinite;
  }
  .qs-orb-1 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #6366f1, #312e81);
    top: -100px; left: -100px;
    animation-delay: 0s;
  }
  .qs-orb-2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, #06b6d4, #0e7490);
    bottom: -80px; right: -80px;
    animation-delay: -6s;
  }
  .qs-orb-3 {
    width: 200px; height: 200px;
    background: radial-gradient(circle, #8b5cf6, #4c1d95);
    top: 50%; right: 20%;
    animation-delay: -3s;
  }

  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -30px) scale(1.05); }
    66% { transform: translate(-15px, 20px) scale(0.95); }
  }

  /* Card */
  .qs-card {
    position: relative;
    z-index: 10;
    width: 420px;
    background: rgba(15, 15, 25, 0.85);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 24px;
    padding: 48px 40px;
    backdrop-filter: blur(24px);
    box-shadow: 0 0 60px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.5);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }

  @keyframes cardIn {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Logo mark */
  .qs-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
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
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .qs-subheading {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 32px;
  }

  /* Error */
  .qs-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    padding: 12px 14px;
    color: #fca5a5;
    font-size: 13px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: shakeIn 0.4s ease;
  }

  @keyframes shakeIn {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  /* Input group */
  .qs-field {
    margin-bottom: 18px;
    position: relative;
  }
  .qs-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }
  .qs-input-wrap {
    position: relative;
  }
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
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1);
  }
  .qs-input:focus + .qs-field-glow {
    opacity: 1;
  }
  .qs-input-focused .qs-input-icon { color: #6366f1; }

  /* Password toggle */
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
    font-size: 16px;
  }
  .qs-pw-toggle:hover { color: #6366f1; }

  /* Submit button */
  .qs-btn {
    width: 100%;
    margin-top: 8px;
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
  .qs-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  .qs-btn-shine {
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: btnShine 3s ease-in-out infinite;
  }
  @keyframes btnShine {
    from { left: -100%; }
    to { left: 200%; }
  }

  /* Spinner */
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

  /* Divider */
  .qs-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: #334155;
    font-size: 12px;
  }
  .qs-divider::before, .qs-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(100,116,139,0.2);
  }

  /* Footer link */
  .qs-footer {
    text-align: center;
    font-size: 13.5px;
    color: #475569;
    margin-top: 20px;
  }
  .qs-footer a {
    color: #818cf8;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  .qs-footer a:hover { color: #a5b4fc; }

  /* Floating particles */
  .qs-particle {
    position: absolute;
    width: 3px; height: 3px;
    background: #6366f1;
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
`;

function LoginParticles() {
  return (
    <>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="qs-particle"
          style={{
            left: `${8 + i * 8}%`,
            animationDuration: `${6 + (i % 5) * 2}s`,
            animationDelay: `${(i * 0.7) % 6}s`,
            background: i % 2 === 0 ? '#6366f1' : '#06b6d4',
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
          }}
        />
      ))}
    </>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      const { role } = res.data;
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);
      if (role === "CUSTOMER") navigate("/dashboard");
      else if (role === "PROVIDER") navigate("/provider-dashboard");
      else navigate("/login");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="qs-login-root">
        <div className="qs-grid" />
        <div className="qs-orb qs-orb-1" />
        <div className="qs-orb qs-orb-2" />
        <div className="qs-orb qs-orb-3" />
        <LoginParticles />

        <div className="qs-card">
          <div className="qs-logo">
            <div className="qs-logo-icon">Q</div>
            <div className="qs-logo-text">Quick<span>Serve</span></div>
          </div>

          <h2 className="qs-heading">Welcome back 👋</h2>
          <p className="qs-subheading">Sign in to continue to your account</p>

          {error && (
            <div className="qs-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className={`qs-field ${focusedField === 'email' ? 'qs-input-focused' : ''}`}>
              <label className="qs-label">Email Address</label>
              <div className="qs-input-wrap">
                <svg className="qs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  className="qs-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>

            <div className={`qs-field ${focusedField === 'password' ? 'qs-input-focused' : ''}`}>
              <label className="qs-label">Password</label>
              <div className="qs-input-wrap">
                <svg className="qs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  className="qs-input"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <button
                  type="button"
                  className="qs-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="qs-btn" disabled={loading}>
              <span className="qs-btn-shine" />
              {loading ? (
                <><span className="qs-spinner" /> Signing in...</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="qs-divider">or</div>

          <p className="qs-footer">
            Don't have an account? <Link to="/signup">Create one free</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;