import React, { useContext, useEffect, useState } from "react";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { AuthContext } from "../contextAPI/Authcontext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

function Portfolio() {
  const { cursorPos } = useContext(CursorContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE_URL}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPortfolio(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch portfolio data");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [token, navigate]);

  const totalInvested =
    portfolio?.funds?.reduce((acc, f) => acc + (f.investedValue || 0), 0) || 0;

  const totalUnits =
    portfolio?.funds?.reduce((acc, f) => acc + (f.units || 0), 0) || 0;

  return (
    <div className="min-h-screen spg overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 font-sans transition duration-500">
      
      {/* Cursor glow */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(59,130,246,0.25), transparent 80%)`,
        }}
      />

      <Navbar />

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 relative z-1">

        <div>
          <h2 className="text-3xl font-bold">Portfolio Summary</h2>
          <p className="text-slate-500 text-sm">
            Overview of your holdings and performance
          </p>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-slate-400 text-sm">Current Budget</p>
                <p className="text-2xl font-bold text-cyan-300">
                  ₹{(portfolio?.remainingBalance ?? 0).toFixed(2)}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-slate-400 text-sm">Total Invested</p>
                <p className="text-2xl font-bold">₹{totalInvested.toFixed(2)}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-slate-400 text-sm">Total Units</p>
                <p className="text-2xl font-bold">{totalUnits.toFixed(4)}</p>
              </div>
            </div>

            {/* HOLDINGS */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Holdings</h3>

              {!portfolio?.funds?.length ? (
                <p className="text-slate-400">No holdings yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-slate-300">
                      <tr>
                        {["Symbol", "Qty", "NAV", "Invested", "Current", "P/L"].map(
                          (h) => (
                            <th key={h} className="text-left px-4 py-3">
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                      {portfolio.funds.map((f, i) => (
                        <tr key={i} className="hover:bg-white/5 transition">
                          <td className="px-4 py-3">{f.symbol}</td>
                          <td className="px-4 py-3">{f.units}</td>
                          {/* <td className="px-4 py-3">
                            ₹{f.units ? (f.investedValue / f.units).toFixed(2) : "0.00"}
                          </td> */}
                          <td className="px-4 py-3">₹{f.nav}</td>
                          <td className="px-4 py-3">₹{f.investedValue}</td>
                          <td className="px-4 py-3">₹{f.currentValue}</td>
                          <td
                            className={`px-4 py-3 font-medium ${
                              f.profitLoss >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {f.profitLoss}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default Portfolio;