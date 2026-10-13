import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

const CATEGORY_GROUPS = [
  { key: "flexi-cap", title: "Flexi cap", description: "Flexible across market capitalisations", categories: ["Equity Scheme - Flexi Cap Fund", "Equity Schemes - Flexi Cap Fund"] },
  { key: "large-cap", title: "Large cap & large-mid cap", description: "Established and large businesses", categories: ["Equity Scheme - Large Cap Fund", "Equity Schemes - Large Cap Fund", "Equity Scheme - Large & Mid Cap Fund", "Equity Schemes - Large & Mid Cap Fund"] },
  { key: "mid-cap", title: "Mid cap", description: "Medium-sized listed businesses", categories: ["Equity Scheme - Mid Cap Fund", "Equity Schemes - Mid Cap Fund"] },
  { key: "hybrid", title: "Hybrid funds", description: "A mix of equity and debt exposure", categories: ["Hybrid Scheme - Aggressive Hybrid Fund", "Hybrid Schemes - Aggressive Hybrid Fund", "Hybrid Scheme - Arbitrage Fund", "Hybrid Schemes - Arbitrage Fund", "Hybrid Scheme - Conservative Hybrid Fund", "Hybrid Schemes - Conservative Hybrid Fund", "Hybrid Scheme - Dynamic Asset Allocation or Balanced Advantage", "Hybrid Schemes - Dynamic Asset Allocation or Balanced Advantage", "Hybrid Scheme - Equity Savings", "Hybrid Schemes - Equity Savings"] },
  { key: "index", title: "Index funds", description: "Designed to track a market index", categories: ["Other Scheme - Index Funds", "Index Funds - Equity Funds"] },
];
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

function Trade() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchFunds = async () => {
      try {
        setFetchError("");
        const response = await fetch(`${API_BASE_URL}/`);
        if (!response.ok) throw new Error(`The fund service returned ${response.status}.`);
        const data = await response.json();
        if (!cancelled) setFunds(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) setFetchError(error.message || "Unable to load mutual fund schemes.");
      } finally { if (!cancelled) setLoading(false); }
    };
    fetchFunds();
    return () => { cancelled = true; };
  }, []);

  const categoryToGroup = useMemo(() => {
    const map = new Map();
    CATEGORY_GROUPS.forEach((group) => group.categories.forEach((category) => map.set(category, group.key)));
    return map;
  }, []);
  const allGroups = [{ key: "all", title: "All schemes", description: "Browse every available fund", categories: [] }, ...CATEGORY_GROUPS];
  const visibleFunds = useMemo(() => {
    const query = search.trim().toLowerCase();
    return funds.filter((fund) => {
      const code = String(fund["Scheme Code"] || "").toLowerCase();
      const name = String(fund["Scheme Name"] || "").toLowerCase();
      const queryMatch = !query || code.includes(query) || name.includes(query);
      const categoryMatch = activeGroup === "all" || categoryToGroup.get(fund.category) === activeGroup;
      return queryMatch && categoryMatch;
    });
  }, [funds, search, activeGroup, categoryToGroup]);
  const groupCount = (groupKey) => groupKey === "all" ? funds.length : funds.filter((fund) => categoryToGroup.get(fund.category) === groupKey).length;

  return <div className="mfd-page"><Navbar/><main className="page-container page-content">
    <div className="page-header"><div><span className="eyebrow">Mutual fund explorer</span><h1>Find a fund to learn about</h1><p>Browse scheme names, review the latest available NAV and open a fund to study its history, holdings and SIP options.</p></div><div className="data-freshness"><span className="freshness-dot"/> </div></div>
    <section className="explorer-summary"><div className="explorer-summary-icon">↗</div><div><strong>Explore before you invest</strong><p>This is a paper-trading environment. Opening a scheme lets you inspect its information and practise with virtual funds — no real order is placed.</p></div><span className="tag">Learning mode</span></section>
    <div className="explorer-layout">
      <aside className="category-sidebar surface"><div className="category-sidebar-heading"><h2>Fund categories</h2><span>{funds.length || "—"}</span></div><div className="category-options">{allGroups.map((group) => <button type="button" key={group.key} onClick={() => setActiveGroup(group.key)} className={`category-option ${activeGroup === group.key ? "selected" : ""}`}><span className="category-option-marker">{group.key === "all" ? "◫" : group.key === "flexi-cap" ? "↗" : group.key === "large-cap" ? "◈" : group.key === "mid-cap" ? "◉" : group.key === "hybrid" ? "◇" : "⌁"}</span><span className="category-option-copy"><strong>{group.title}</strong><small>{group.description}</small></span><span className="category-count">{groupCount(group.key)}</span></button>)}</div><div className="category-sidebar-note"><span>ⓘ</span><p>Different fund categories can carry different levels of market risk. Understand the scheme before acting.</p></div></aside>
      <section className="fund-results surface"><div className="fund-results-top"><div><h2>{allGroups.find((group) => group.key === activeGroup)?.title || "Available schemes"}</h2><p>{loading ? "Refreshing scheme list…" : `${visibleFunds.length.toLocaleString("en-IN")} scheme${visibleFunds.length === 1 ? "" : "s"} available in this view`}</p></div><label className="fund-search-wrap"><span>⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by scheme name or code" aria-label="Search schemes"/><kbd>↵</kbd></label></div>
        {loading ? <div className="loading-state">Loading available schemes…</div> : fetchError ? <div className="explorer-error"><div className="empty-icon">!</div><h3>Fund data is temporarily unavailable</h3><p>{fetchError}</p><button type="button" className="secondary-button" onClick={() => window.location.reload()}>Reload schemes</button></div> : visibleFunds.length === 0 ? <div className="empty-state"><div className="empty-icon">⌕</div><h3>No matching schemes</h3><p>Try a different scheme name or switch to another category.</p><button type="button" className="secondary-button" onClick={() => { setSearch(""); setActiveGroup("all"); }}>Clear filters</button></div> : <><div className="table-wrap fund-table-wrap"><table className="data-table fund-list-table"><thead><tr><th>Scheme</th><th>Latest NAV</th><th>NAV date</th><th></th></tr></thead><tbody>{visibleFunds.map((fund) => <tr className="fund-row-clickable" key={fund["Scheme Code"]} onClick={() => navigate(`/trade/stockinfo/${fund["Scheme Code"]}`)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") navigate(`/trade/stockinfo/${fund["Scheme Code"]}`); }}><td><div className="fund-table-name"><span className="fund-monogram fund-monogram-green">{String(fund["Scheme Name"] || "M").replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase() || "M"}</span><span><strong>{fund["Scheme Name"] || "Unnamed scheme"}</strong><small>Code {fund["Scheme Code"]}</small></span></div></td><td className="number-cell nav-cell">{money(fund["Net Asset Value"])}</td><td className="number-cell nav-date-cell">{fund["Date"] || "—"}</td><td><span className="row-open">View details <b>→</b></span></td></tr>)}</tbody></table></div><div className="fund-results-footer"><span>Showing {visibleFunds.length.toLocaleString("en-IN")} of {funds.length.toLocaleString("en-IN")} schemes</span><span>NAV values may be delayed by the source update schedule.</span></div></>}
      </section>
    </div>
    <p className="disclaimer-note">Mutual fund values and scheme data are displayed for educational purposes. MFD does not accept real investments or provide personalised investment recommendations.</p>
  </main></div>;
}

export default Trade;
