import { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contextAPI/Authcontext";
import { API_BASE_URL } from "../lib/api";
import { removeCookie } from "../lib/api";
import axios from "axios";

function Navbar() {
  const { isAuthenticated, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinks = [
    { to: "/portfolio", label: "Portfolio", hover: "hover:text-cyan-500" },
    { to: "/trade", label: "Trade", hover: "hover:text-green-500" },
    { to: "/lessons", label: "Lessons", hover: "hover:text-red-500" },
    { to: "/leaderboard", label: "Leaderboard", hover: "hover:text-yellow-500" },
    { to: "/trade-history", label: "Trade History", hover: "hover:text-emerald-500" },
  ];

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    removeCookie("token");
    removeCookie("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    logout();
    navigate("/signin");
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/user/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      logout();
      navigate("/signin");
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Delete failed. Try again.");
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <nav className="relative z-99 backdrop-blur-lg bg-white/30 dark:bg-slate-800/30 border-b border-white/20 dark:border-slate-700/20 shadow-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent cursor-pointer truncate">
            <Link to={isAuthenticated ? "/home" : "/"}>Market for Dummies</Link>
          </h1>

          <ul className="hidden md:flex space-x-6 lg:space-x-8 font-medium mr-3 flex-shrink-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={`${link.hover} transition`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Profile</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/40 shadow-2xl z-50 py-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setDeleteError("");
                        setShowDeleteModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 transition rounded-xl flex items-center gap-2"
                    >
                    Delete Account
                    </button>
                    <hr className="my-1 border-white/20 dark:border-slate-600/40" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition rounded-xl flex items-center gap-2"
                    >
                    Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="hidden md:inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger toggle - mobile & tablet only */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/40 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700/40 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-slate-700/30 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl">
            <ul className="px-4 sm:px-6 py-3 space-y-1 font-medium">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg ${link.hover} hover:bg-white/40 dark:hover:bg-slate-800/60 transition`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="px-4 sm:px-6 pb-4 pt-1 border-t border-white/20 dark:border-slate-700/30">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDeleteError("");
                      setShowDeleteModal(true);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800/60 transition"
                  >
                    Delete Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-white/20 dark:border-slate-700/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
              Delete your account?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This permanently deletes your account, portfolio, and trade history. This action
              cannot be undone.
            </p>

            {deleteError && (
              <p className="text-sm text-red-500">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
