import { useContext, useEffect, useState } from "react";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { AuthContext } from "../contextAPI/Authcontext";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

const STARTING_BALANCE = 10000;

function Leaderboard() {
  const { cursorPos } = useContext(CursorContext);
  const { token } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        // GET /leaderboard requires auth and returns
        // [{ username, totalValue, remainingBalance }]
        const res = await axios.get(`${API_BASE_URL}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portfolios = Array.isArray(res.data) ? res.data : [];

        const mapped = portfolios.map((p) => {
          const totalValue = Number(p.totalValue) || 0;
          const balance = Number(p.remainingBalance) || 0;
          const returnPct =
            STARTING_BALANCE > 0
              ? (((totalValue - STARTING_BALANCE) / STARTING_BALANCE) * 100).toFixed(2)
              : "0.00";

          return {
            displayName: p.username,
            balance,
            totalValue,
            returnPct: `${returnPct}%`,
            isPositive: parseFloat(returnPct) >= 0,
          };
        });

        // Backend already sorts by totalValue desc, but keep this stable.
        mapped.sort((a, b) => b.totalValue - a.totalValue);
        setLeaderboard(mapped);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        setError("Unable to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [token]);

  const topThree = leaderboard.slice(0, 3);
  const totalValue = leaderboard.reduce((s, p) => s + p.totalValue, 0);

  return (
    <div className="min-h-screen spg overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 font-sans transition duration-500">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(59,130,246,0.25), transparent 80%)`,
        }}
      />

      <Navbar />

      <main className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10">
        <section className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-300">
            Community rankings
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
            Leaderboard
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Real-time portfolio rankings across all registered traders.
          </p>
        </section>

        {loading ? (
          <p className="text-center text-lg mt-8 text-gray-500">
            Loading leaderboard...
          </p>
        ) : error ? (
          <p className="text-center text-red-400 mt-8">{error}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No registered traders yet. Sign up and start trading!
          </p>
        ) : (
          <>
            {/* Summary cards */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg p-5 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Top trader</p>
                <p className="mt-2 text-2xl font-bold">{topThree[0]?.displayName || "—"}</p>
                <p className="text-cyan-600 dark:text-cyan-300">
                  ₹{topThree[0]?.totalValue - topThree[0]?.balance} portfolio value
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg p-5 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total active traders</p>
                <p className="mt-2 text-2xl font-bold">{leaderboard.length}</p>
                <p className="text-emerald-600 dark:text-emerald-300">Top 10 shown</p>
              </div>
              <div className="rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg p-5 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Combined portfolio value</p>
                <p className="mt-2 text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
                <p className="text-amber-600 dark:text-amber-300">All time</p>
              </div>
            </section>

            {/* Full table */}
            <section className="rounded-3xl border border-white/20 dark:border-slate-700/40 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 shadow-2xl">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">All Rankings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sorted by total portfolio value (balance + holdings)
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/20 dark:border-slate-700/40 bg-white/70 dark:bg-slate-900/40">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-100 dark:bg-slate-800/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Trader</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Portfolio Value</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Balance</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Return</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {leaderboard.map((player, index) => (
                      <tr
                        key={`${player.displayName}-${index}`}
                        className="hover:bg-cyan-50 dark:hover:bg-slate-800/60 transition"
                      >
                        <td className="px-4 py-3 font-semibold">#{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{player.displayName}</td>
                        <td className="px-4 py-3 font-semibold">₹{player.totalValue - player.balance}</td>
                        <td className="px-4 py-3">₹{player.balance.toLocaleString()}</td>
                        <td
                          className={`px-4 py-3 font-semibold ${
                            player.isPositive
                              ? "text-emerald-600 dark:text-emerald-300"
                              : "text-red-500 dark:text-red-400"
                          }`}
                        >
                          {player.returnPct}
                        </td>
                      </tr>
                    ))}
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

export default Leaderboard;
