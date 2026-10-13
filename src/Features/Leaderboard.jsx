import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contextAPI/Authcontext";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

const STARTING_BALANCE = 10000;
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
function Leaderboard() {
  const { token } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    let cancelled = false;
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/leaderboard`, { headers: { Authorization: `Bearer ${token}` } });
        const portfolios = Array.isArray(response.data) ? response.data : [];
        const mapped = portfolios.map((portfolio) => {
          const totalValue = Number(portfolio.totalValue) || 0;
          const balance = Number(portfolio.remainingBalance) || 0;
          const returnPct = STARTING_BALANCE > 0 ? ((totalValue - STARTING_BALANCE) / STARTING_BALANCE) * 100 : 0;
          return { displayName: portfolio.username || "Investor", balance, totalValue, returnPct, isPositive: returnPct >= 0 };
        }).sort((a, b) => b.totalValue - a.totalValue);
        if (!cancelled) setLeaderboard(mapped);
      } catch {
        if (!cancelled) setError("Unable to load community rankings. Please try again later.");
      } finally { if (!cancelled) setLoading(false); }
    };
    fetchLeaderboard();
    return () => { cancelled = true; };
  }, [token]);

  const totalValue = leaderboard.reduce((sum, person) => sum + person.totalValue, 0);
  const topThree = leaderboard.slice(0, 3);
  return <div className="mfd-page"><Navbar/><main className="page-container page-content">
    <div className="page-header"><div><span className="eyebrow">Community practice</span><h1>Practice leaderboard</h1><p>Compare simulated portfolio values with other learners. Rankings are based on paper-trading account values, not real investment performance.</p></div><div className="leaderboard-period"><span className="leaderboard-period-dot"/> All-time rankings</div></div>
    <div className="metric-grid leaderboard-metrics"><article className="metric-card"><span className="metric-label">Participants</span><strong className="metric-value">{loading ? "—" : leaderboard.length}</strong><span className="metric-note">Accounts included in rankings</span></article><article className="metric-card"><span className="metric-label">Combined portfolio value</span><strong className="metric-value">{loading ? "—" : money(totalValue)}</strong><span className="metric-note">Across visible participants</span></article><article className="metric-card"><span className="metric-label">Starting practice balance</span><strong className="metric-value">{money(STARTING_BALANCE)}</strong><span className="metric-note">Allocated at the start of each account</span></article></div>
    {loading ? <section className="surface loading-state">Loading community rankings…</section> : error ? <section className="surface empty-state"><div className="empty-icon">!</div><h3>Rankings unavailable</h3><p>{error}</p><button className="secondary-button" onClick={() => window.location.reload()}>Try again</button></section> : <>
      {topThree.length > 0 && <section className="top-performers"><div className="section-row"><div><h2>Top practice portfolios</h2><p>Highest total portfolio values in the current ranking.</p></div><span className="tag tag-neutral">Top {topThree.length}</span></div><div className="performer-grid">{topThree.map((person, index) => <article className={`performer-card performer-rank-${index + 1}`} key={`${person.displayName}-${index}`}><div className="performer-top"><span className="performer-rank">{String(index + 1).padStart(2, "0")}</span><span className={`tag ${person.isPositive ? "" : "tag-red"}`}>{person.returnPct >= 0 ? "+" : ""}{person.returnPct.toFixed(2)}%</span></div><div className="performer-avatar">{String(person.displayName).slice(0, 1).toUpperCase()}</div><h3>{person.displayName}</h3><span className="performer-caption">Practice portfolio value</span><strong className="performer-value">{money(person.totalValue)}</strong><div className="performer-divider"/><div className="performer-foot"><span>Virtual balance</span><strong>{money(person.balance)}</strong></div></article>)}</div></section>}
      <section className="surface ranking-surface"><div className="holdings-heading"><div><h2 className="surface-title">Full rankings</h2><p className="surface-subtitle">A snapshot of the community's simulated account values.</p></div><span className="tag tag-neutral">{leaderboard.length} participants</span></div>{leaderboard.length === 0 ? <div className="empty-state"><div className="empty-icon">♧</div><h3>No rankings yet</h3><p>Once portfolio data is available, participating learners will appear here.</p></div> : <div className="table-wrap"><table className="data-table ranking-table"><thead><tr><th>Rank</th><th>Participant</th><th>Portfolio value</th><th>Virtual balance</th><th>Vs. starting value</th></tr></thead><tbody>{leaderboard.map((person, index) => <tr key={`${person.displayName}-${index}`}><td><span className={`rank-index ${index < 3 ? "rank-index-top" : ""}`}>{String(index + 1).padStart(2, "0")}</span></td><td><div className="leaderboard-person"><span className="leaderboard-avatar">{String(person.displayName).slice(0, 1).toUpperCase()}</span><strong>{person.displayName}</strong>{index === 0 && <span className="tag">Top rank</span>}</div></td><td className="number-cell"><strong>{money(person.totalValue)}</strong></td><td className="number-cell">{money(person.balance)}</td><td className={`number-cell ${person.isPositive ? "text-positive" : "text-negative"}`}>{person.returnPct >= 0 ? "+" : ""}{person.returnPct.toFixed(2)}%</td></tr>)}</tbody></table></div>}</section>
    </>}
    <p className="disclaimer-note">Leaderboard figures are based on simulated transactions and a fixed starting balance. They do not represent real returns, and past practice performance is not predictive of future results.</p>
  </main></div>;
}
export default Leaderboard;
