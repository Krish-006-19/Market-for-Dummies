import { useContext, useEffect, useMemo, useState } from "react";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { AuthContext } from "../contextAPI/Authcontext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

function TradeHistory() {
  const { cursorPos } = useContext(CursorContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyFilter, setHistoryFilter] = useState("all");

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    const fetchTrades = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/trade`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mapped = res.data.map(t => ({
          id: t._id,
          date: new Date(t.createdAt).toLocaleDateString(),
          symbol: t.symbol,
          action: t.type === 'BUY' ? 'Buy' : 'Sell',
          qty: t.quantity,
          price: t.price,
          value: t.amount,
          pnl: "N/A",
          status: "Executed"
        }));
        setTradeHistory(mapped);
      } catch (err) {
        console.error("Failed to fetch trades", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, [token, navigate]);

  const visibleHistory = useMemo(() => {
    if (historyFilter === "all") return tradeHistory;
    return tradeHistory.filter((entry) => entry.action.toLowerCase() === historyFilter);
  }, [historyFilter, tradeHistory]);

  const totalValue = useMemo(
    () => visibleHistory.reduce((sum, trade) => sum + trade.value, 0),
    [visibleHistory],
  );

  return (
    <div className="min-h-screen overflow-hidden spg bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 font-sans transition duration-500">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(16,185,129,0.25), transparent 80%)`,
        }}
      />

      <Navbar />

      <main className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <section className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">Activity log</p>
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Trade History
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Review buys, sells, execution status, and trade values on a dedicated page.
          </p>
        </section>

        {loading ? (
          <p className="text-center text-lg mt-8">Loading trade history...</p>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg p-5 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Visible trades</p>
                <p className="mt-2 text-2xl font-bold">{visibleHistory.length}</p>
              </div>
              <div className="rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg p-5 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total trade value</p>
                <p className="mt-2 text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg p-5 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Filter</p>
                <p className="mt-2 text-2xl font-bold capitalize">{historyFilter}</p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/20 dark:border-slate-700/40 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 shadow-2xl space-y-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Recent transactions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Filter by buy or sell to inspect your activity quickly.</p>
                </div>
                <div className="inline-flex rounded-full bg-white/60 dark:bg-slate-900/50 p-1 border border-white/20 dark:border-slate-700/40">
                  {["all", "buy", "sell"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setHistoryFilter(item)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition capitalize ${
                        historyFilter === item
                          ? "bg-emerald-500 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:text-emerald-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/70 dark:bg-slate-900/40">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-100 dark:bg-slate-800/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Symbol</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Qty</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Value</th>
                      {/* <th className="px-4 py-3 text-left text-sm font-semibold">P/L</th> */}
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {visibleHistory.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-3 text-center text-gray-500">No trades found.</td>
                      </tr>
                    ) : (
                      visibleHistory.map((trade) => (
                        <tr key={trade.id} className="hover:bg-emerald-50 dark:hover:bg-slate-800/60 transition">
                          <td className="px-4 py-3 text-sm">{trade.date}</td>
                          <td className="px-4 py-3 font-semibold">{trade.symbol}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                trade.action === "Buy"
                                  ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200"
                              }`}
                            >
                              {trade.action}
                            </span>
                          </td>
                          <td className="px-4 py-3">{trade.qty}</td>
                          <td className="px-4 py-3">₹{trade.price}</td>
                          <td className="px-4 py-3">₹{trade.value.toLocaleString()}</td>
                          {/* <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-300">{trade.pnl}</td> */}
                          <td className="px-4 py-3">{trade.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default TradeHistory;