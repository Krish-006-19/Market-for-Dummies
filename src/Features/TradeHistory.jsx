import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contextAPI/Authcontext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function TradeHistory() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");

  useEffect(() => {
    if (!token) { navigate("/signin"); return; }
    let cancelled = false;
    const fetchTrades = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/trade`, { headers: { Authorization: `Bearer ${token}` } });
        const items = Array.isArray(response.data) ? response.data : [];
        const mapped = items.map((trade) => ({ id: trade._id, date: trade.createdAt ? new Date(trade.createdAt) : null, symbol: trade.symbol, action: trade.type === "BUY" ? "Buy" : "Sell", qty: Number(trade.quantity || 0), price: Number(trade.price || 0), value: Number(trade.amount || 0), status: "Executed" })).sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
        if (!cancelled) setTradeHistory(mapped);
      } catch (error) {
        if (!cancelled) setLoadError(error.response?.data?.error || "Unable to load your transactions.");
      } finally { if (!cancelled) setLoading(false); }
    };
    fetchTrades();
    return () => { cancelled = true; };
  }, [token, navigate]);

  const visibleHistory = useMemo(() => historyFilter === "all" ? tradeHistory : tradeHistory.filter((trade) => trade.action.toLowerCase() === historyFilter), [historyFilter, tradeHistory]);
  const totalValue = useMemo(() => visibleHistory.reduce((sum, trade) => sum + trade.value, 0), [visibleHistory]);
  const buyCount = tradeHistory.filter((trade) => trade.action === "Buy").length;
  const sellCount = tradeHistory.length - buyCount;
  const formatDate = (date) => date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date) : "—";

  return <div className="mfd-page"><Navbar/><main className="page-container page-content">
    <div className="page-header"><div><span className="eyebrow">Account activity</span><h1>Transactions</h1><p>Review every simulated buy and sell made in your practice portfolio.</p></div><Link className="secondary-button" to="/portfolio" onClick={(event) => { event.preventDefault(); navigate("/portfolio"); }}>← Back to portfolio</Link></div>
    <div className="metric-grid"><article className="metric-card"><span className="metric-label">Total transactions</span><strong className="metric-value">{tradeHistory.length}</strong><span className="metric-note">All completed paper trades</span></article><article className="metric-card"><span className="metric-label">Buy orders</span><strong className="metric-value">{buyCount}</strong><span className="metric-note">Units added to your practice holdings</span></article><article className="metric-card"><span className="metric-label">Sell orders</span><strong className="metric-value">{sellCount}</strong><span className="metric-note">Units sold from your practice holdings</span></article></div>
    <section className="surface transaction-surface"><div className="holdings-heading"><div><h2 className="surface-title">Transaction history</h2><p className="surface-subtitle">Showing {visibleHistory.length} transaction{visibleHistory.length === 1 ? "" : "s"} · total value {money(totalValue)}</p></div><div className="segmented-filter">{["all", "buy", "sell"].map((option) => <button key={option} type="button" onClick={() => setHistoryFilter(option)} className={historyFilter === option ? "selected" : ""}>{option === "all" ? "All activity" : option === "buy" ? "Buys" : "Sells"}</button>)}</div></div>
      {loading ? <div className="loading-state">Loading transaction history…</div> : loadError ? <div className="empty-state"><div className="empty-icon">!</div><h3>Could not load transactions</h3><p>{loadError}</p><button className="secondary-button" onClick={() => window.location.reload()}>Try again</button></div> : !visibleHistory.length ? <div className="empty-state"><div className="empty-icon">↔</div><h3>No transactions to show</h3><p>{tradeHistory.length ? "There are no transactions matching this filter." : "Your completed paper trades will appear here. Explore a fund to make your first practice transaction."}</p>{tradeHistory.length ? <button type="button" className="secondary-button" onClick={() => setHistoryFilter("all")}>Show all transactions</button> : <Link to="/trade" className="primary-button">Explore funds →</Link>}</div> : <div className="table-wrap"><table className="data-table transaction-table"><thead><tr><th>Date & time</th><th>Scheme code</th><th>Action</th><th>Units</th><th>NAV at trade</th><th>Transaction value</th><th>Status</th></tr></thead><tbody>{visibleHistory.map((trade) => <tr key={trade.id}><td className="date-table-cell">{formatDate(trade.date)}<small>{trade.date && !Number.isNaN(trade.date.getTime()) ? trade.date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</small></td><td><strong>{trade.symbol || "—"}</strong></td><td><span className={`tag ${trade.action === "Buy" ? "" : "tag-red"}`}>{trade.action}</span></td><td className="number-cell">{trade.qty.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td><td className="number-cell">{money(trade.price)}</td><td className="number-cell transaction-value">{money(trade.value)}</td><td><span className="status-dot-label"><i/>{trade.status}</span></td></tr>)}</tbody></table></div>}
    </section>
    <p className="disclaimer-note">Transaction records reflect practice activity only. They are not exchange orders, confirmations or records of real investments.</p>
  </main></div>;
}

export default TradeHistory;
