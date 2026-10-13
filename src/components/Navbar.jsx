import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contextAPI/Authcontext";
import { API_BASE_URL, removeCookie } from "../lib/api";
import axios from "axios";

function Navbar() {
  const { isAuthenticated, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  const navLinks = [
    { to: "/portfolio", label: "My portfolio" },
    { to: "/trade", label: "Explore funds" },
    { to: "/trade-history", label: "Transactions" },
    { to: "/lessons", label: "Learn" },
    { to: "/leaderboard", label: "Community" },
  ];
  const publicLinks = [
    { to: "/trade", label: "Explore funds" },
    // { to: "/#how-it-works", label: "How it works" },
  ];
  const visibleLinks = isAuthenticated ? navLinks : publicLinks;

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    removeCookie("token");
    removeCookie("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    logout();
    navigate("/signin");
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/user/delete`, { headers: { Authorization: `Bearer ${token}` } });
      setShowDeleteModal(false);
      removeCookie("token");
      removeCookie("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      logout();
      navigate("/signin");
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Account deletion failed. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <header className="mfd-navbar">
        <div className="mfd-navbar-inner">
          <Link className="brand-lockup" to={isAuthenticated ? "/home" : "/"} aria-label="Market for Dummies home">
            <span className="brand-symbol">m</span>
            <span><span className="brand-name">Market for Dummies</span><span className="brand-caption">Learn. Practice. Invest.</span></span>
          </Link>

          <nav className="mfd-nav-links" aria-label="Main navigation">
            {visibleLinks.map((item) => <Link key={item.to} to={item.to} className={`mfd-nav-link ${location.pathname === item.to || (item.to === "/trade" && location.pathname.startsWith("/trade/stockinfo")) ? "active" : ""}`}>{item.label}</Link>)}
          </nav>

          <div className="mfd-nav-actions">
            <span className="paper-status"><span /></span>
            {isAuthenticated ? <div className="profile-wrap" ref={dropdownRef}>
              <button className="profile-trigger" type="button" aria-expanded={dropdownOpen} onClick={() => setDropdownOpen((open) => !open)}>
                <span className="profile-avatar">{(localStorage.getItem("email") || "U").charAt(0).toUpperCase()}</span><span className="profile-label">Account</span><span className={`chevron ${dropdownOpen ? "up" : ""}`}>⌄</span>
              </button>
              {dropdownOpen && <div className="profile-menu">
                <div className="profile-menu-heading">Your account</div>
                <button type="button" onClick={() => { setDropdownOpen(false); setDeleteError(""); setShowDeleteModal(true); }}>Delete account</button>
                <button type="button" onClick={handleLogout}>Sign out</button>
              </div>}
            </div> : <Link to="/signin" className="nav-signin">Sign in <span>↗</span></Link>}
            <button className="mobile-menu-button" type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? "×" : "☰"}</button>
          </div>
        </div>
        {mobileMenuOpen && <div className="mfd-mobile-menu">
          {visibleLinks.map((item) => <Link key={item.to} to={item.to} className={location.pathname === item.to ? "active" : ""}>{item.label}<span>›</span></Link>)}
          {isAuthenticated ? <button type="button" onClick={handleLogout}>Sign out</button> : <Link to="/signin">Sign in<span>↗</span></Link>}
        </div>}
      </header>

      {showDeleteModal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleteLoading) setShowDeleteModal(false); }}>
        <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="modal-warning-icon">!</div>
          <h2 id="delete-title">Delete your account?</h2>
          <p>This permanently deletes your account, practice portfolio, and transaction history. This action cannot be undone.</p>
          {deleteError && <div className="status-message status-error">{deleteError}</div>}
          <div className="modal-actions"><button className="secondary-button" type="button" disabled={deleteLoading} onClick={() => setShowDeleteModal(false)}>Cancel</button><button className="danger-button" type="button" disabled={deleteLoading} onClick={handleDeleteAccount}>{deleteLoading ? "Deleting…" : "Delete account"}</button></div>
        </section>
      </div>}
    </>
  );
}

export default Navbar;
