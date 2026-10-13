import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contextAPI/Authcontext";

function Signin() {
  const { login, register, getOtp, otpRequired, isAuthenticated, authReady } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const from = location.state?.from?.pathname || "/trade";

  useEffect(() => { if (authReady && isAuthenticated) navigate(from, { replace: true }); }, [authReady, isAuthenticated, navigate, from]);
  useEffect(() => { if (cooldown <= 0) return; const timer = setTimeout(() => setCooldown((value) => value - 1), 1000); return () => clearTimeout(timer); }, [cooldown]);
  const resetOtp = () => { setOtp(""); setOtpSent(false); setCooldown(0); };
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) => value.length >= 6;
  const validateUsername = (value) => value.trim().length >= 3;

  const handleSendOtp = async () => {
    setError(""); setMsg("");
    const cleanEmail = email.trim();
    if (!cleanEmail) return setError("Enter your email first");
    if (!validateEmail(cleanEmail)) return setError("Invalid email format");
    setSendingOtp(true);
    const response = await getOtp(cleanEmail);
    setSendingOtp(false);
    if (response.success) { setOtpSent(true); setCooldown(response.retryAfter || 60); setMsg(`OTP sent to ${cleanEmail}. It expires in 5 minutes.`); }
    else { if (response.retryAfter) setCooldown(response.retryAfter); setError(response.message); }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); setError(""); setMsg("");
    const cleanEmail = email.trim(); const cleanPassword = password; const cleanUsername = username.trim();
    if (!cleanEmail || !cleanPassword) return setError("Email and password are required");
    if (!validateEmail(cleanEmail)) return setError("Invalid email format");
    if (!validatePassword(cleanPassword)) return setError("Password must be at least 6 characters");
    if (!isLogin && !validateUsername(cleanUsername)) return setError("Username must be at least 3 characters");
    if (!isLogin && otpRequired && !/^\d{6}$/.test(otp.trim())) return setError(otpSent ? "Enter the 6-digit OTP sent to your email" : "Click 'Send code' and enter the 6-digit code from your email");
    if (isLogin) {
      const response = await login(cleanEmail, cleanPassword);
      if (response.success) { localStorage.setItem("email", cleanEmail); navigate(from, { replace: true }); }
      else setError(response.message);
    } else {
      const response = await register(cleanUsername, cleanEmail, cleanPassword, otp.trim());
      if (response.success) { localStorage.setItem("email", cleanEmail); setMsg("Registration successful. Please sign in."); setIsLogin(true); setPassword(""); setUsername(""); resetOtp(); }
      else setError(response.message);
    }
  };

  return <div className="mfd-page auth-page">
    <header className="auth-navbar"><div className="page-container auth-navbar-inner"><Link className="brand-lockup" to="/"><span className="brand-symbol">m</span><span><span className="brand-name">Market for Dummies</span><span className="brand-caption">Learn. Practice. Invest.</span></span></Link><Link to="/" className="auth-back-link">← Back to home</Link></div></header>
    <main className="auth-layout page-container">
      <section className="auth-story"><span className="eyebrow">A better way to start</span><h1>Understand investing.<br/><em>Before you put money in.</em></h1><p>Practice with mutual fund data, learn how NAV works and follow your portfolio in a risk-free learning environment.</p><div className="auth-benefits"><div><span className="auth-benefit-icon">✓</span><span><strong>Practice with virtual funds</strong><small>Explore how transactions and units work.</small></span></div><div><span className="auth-benefit-icon">◷</span><span><strong>Learn on your schedule</strong><small>Build confidence one concept at a time.</small></span></div><div><span className="auth-benefit-icon">⌁</span><span><strong>Understand real scheme data</strong><small>Review NAV history and fund holdings.</small></span></div></div><div className="auth-quote"><span>“</span><p>Good financial decisions begin with understanding the basics.</p></div></section>
      <section className="auth-card"><div className="auth-card-heading"><div className="auth-card-icon">{isLogin ? "↗" : "＋"}</div><span className="eyebrow">{isLogin ? "Welcome back" : "Get started"}</span><h2>{isLogin ? "Sign in to MFD" : "Create your account"}</h2><p>{isLogin ? "Continue learning with your practice portfolio." : "A few details to set up your learning account."}</p></div>
        {error && <div className="status-message status-error auth-feedback" role="alert">{error}</div>}{msg && <div className="status-message auth-feedback" role="status">{msg}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && <div><label className="field-label" htmlFor="username">Username</label><input id="username" autoComplete="username" className="field-control" type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="How should we address you?" required/></div>}
          <div><label className="field-label" htmlFor="email">Email address</label><input id="email" autoComplete="email" className="field-control" type="email" value={email} onChange={(event) => { setEmail(event.target.value); if (otpSent) resetOtp(); }} placeholder="you@example.com" required/></div>
          {!isLogin && otpRequired && <div><label className="field-label" htmlFor="otp">Email verification code</label><div className="otp-field-row"><input id="otp" className="field-control otp-input" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit code" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} required/><button type="button" className="otp-button" onClick={handleSendOtp} disabled={sendingOtp || cooldown > 0}>{sendingOtp ? "Sending…" : cooldown > 0 ? `${cooldown}s` : otpSent ? "Resend code" : "Send code"}</button></div><small className="field-help">Use the code sent to your email to complete registration.</small></div>}
          <div><label className="field-label" htmlFor="password">Password</label><input id="password" autoComplete={isLogin ? "current-password" : "new-password"} className="field-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" minLength={6} required/></div>
          <button type="submit" className="primary-button auth-submit">{isLogin ? "Sign in" : "Create account"}<span>→</span></button>
        </form>
        <div className="auth-switch">{isLogin ? "New to Market for Dummies?" : "Already have an account?"}<button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); setMsg(""); resetOtp(); }}>{isLogin ? "Create an account" : "Sign in instead"}</button></div>
        <div className="auth-security-note"><span>⌑</span><span>Your account is for educational paper trading only. Never share your password or verification code.</span></div>
      </section>
    </main>
    <footer className="auth-footer page-container"><span>© {new Date().getFullYear()} Market for Dummies</span><span>Education first. Real money stays yours.</span></footer>
  </div>;
}

export default Signin;
