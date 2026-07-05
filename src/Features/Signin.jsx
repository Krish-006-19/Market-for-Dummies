import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { AuthContext } from "../contextAPI/Authcontext";

function Signin() {
  const { cursorPos } = useContext(CursorContext);
  const { login, register, isAuthenticated, authReady } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const from = location.state?.from?.pathname || "/trade";

  useEffect(() => {
    if (authReady && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authReady, isAuthenticated, navigate, from]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateUsername = (username) => {
    return username.trim().length >= 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    const cleanEmail = email.trim();
    const cleanPassword = password;
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Email and password are required");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError("Invalid email format");
      return;
    }

    if (!validatePassword(cleanPassword)) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!isLogin && !validateUsername(cleanUsername)) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (isLogin) {
      const res = await login(cleanEmail, cleanPassword);

      if (res.success) {
        localStorage.setItem("email", cleanEmail);
        navigate(from, { replace: true });
      } else {
        setError(res.message);
      }
    } else {
      const res = await register(cleanUsername, cleanEmail, cleanPassword);

      if (res.success) {
        localStorage.setItem("email", cleanEmail);
        setMsg("Registration successful. Please log in.");
        setIsLogin(true);
        setPassword("");
        setUsername("");
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen spg overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 font-sans transition duration-500">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(59,130,246,0.25), transparent 80%)`,
        }}
      />

      <nav className="relative z-10 backdrop-blur-lg bg-white/30 dark:bg-slate-800/30 border-b border-white/20 dark:border-slate-700/20 shadow-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-center sm:justify-evenly items-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent cursor-pointer">
            <Link to="/">Market for Dummies</Link>
          </h1>
        </div>
      </nav>

      <div className="relative z-10 flex justify-center items-center px-4 py-10 sm:mt-10 md:mt-20">
        <div className="w-full max-w-md bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 p-6 sm:p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {msg && <p className="text-green-500 text-sm text-center mb-4">{msg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-2 rounded-xl shadow-lg hover:scale-105 transition mt-4"
            >
              {isLogin ? "Sign In" : "Register"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMsg("");
              }}
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              {isLogin ? "Register here" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
