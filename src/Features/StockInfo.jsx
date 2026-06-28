import { useContext, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { AuthContext } from "../contextAPI/Authcontext";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const RANGE_OPTIONS = [
  { label: "1M", days: 30 },
  { label: "2M", days: 60 },
  { label: "6M", days: 180 },
  { label: "1Yr", days: 365 },
  { label: "2Yr", days: 365 * 2 },
  { label: "5Yr", days: 365 * 5 },
  { label: "Max", days: Infinity },
];

const parseDate = (str) => {
  if (!str) return null;
  const [dd, mm, yyyy] = str.split("-").map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  return isNaN(d.getTime()) ? null : d;
};

const sanitizeDecimalInput = (value) => {
  let next = String(value ?? "").replace(/[^\d.]/g, "");
  const parts = next.split(".");
  if (parts.length > 2) {
    next = `${parts[0]}.${parts.slice(1).join("")}`;
  }
  if (next.startsWith(".")) next = `0${next}`;
  return next;
};

const yellowDiamondPlugin = {
  id: "yellowDiamond",
  afterDatasetsDraw(chart) {
    const active = chart.getActiveElements();
    if (!active.length) return;

    const { ctx } = chart;
    const el = active[0].element;

    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#facc15";
    ctx.shadowColor = "rgba(250, 204, 21, 0.25)";
    ctx.shadowBlur = 5;
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  },
};

ChartJS.register(yellowDiamondPlugin);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getFundFromPortfolio = (portfolio, symbol) => {
  if (!portfolio || !symbol) return null;
  if (Array.isArray(portfolio.funds)) {
    return portfolio.funds.find((f) => f.symbol === symbol) || null;
  }
  return null;
};

export default function StockInfo() {
  const { cursorPos } = useContext(CursorContext);
  const { token } = useContext(AuthContext);
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [fundMeta, setFundMeta] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [portfolioData, setPortfolioData] = useState(null);
  const storageKey = `sip-ui-${symbol}`;

  const [showSipControls, setShowSipControls] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).showSipControls : false;
  });

  const [sipMode, setSipMode] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).sipMode : "sip";
  });

  const [sipAmount, setSipAmount] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).sipAmount : "";
  });

  const [sellUnits, setSellUnits] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).sellUnits : "";
  });

  const [sipActive, setSipActive] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).sipActive : false;
  });
  const [txState, setTxState] = useState("idle");
  const [txMessage, setTxMessage] = useState("");
  const [selectedRange, setSelectedRange] = useState("Max");
  const [sipData, setSipData] = useState(null);

  useEffect(() => {
    if (!token || !symbol) return;

    axios
      .get(`${API_BASE_URL}/sip/${symbol}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setSipData(res.data))
      .catch(() => setSipData(null));
  }, [token, symbol]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        showSipControls,
        sipMode,
        sipAmount,
        sellUnits,
        sipActive,
      }),
    );
  }, [storageKey, showSipControls, sipMode, sipAmount, sellUnits, sipActive]);
  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [schemeRes, historyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/${symbol}`),
          fetch(`${API_BASE_URL}/history/${symbol}`),
        ]);

        if (schemeRes.ok) setFundMeta(await schemeRes.json());

        let raw = [];
        if (historyRes.ok) {
          const json = await historyRes.json();
          raw = json?.data || json?.history || json || [];
        }

        const formatted = (Array.isArray(raw) ? raw : [])
          .map((item) => {
            const date = parseDate(item?.date);
            const nav = Number(item?.nav);
            if (!date || isNaN(nav)) return null;
            return { x: date, y: nav };
          })
          .filter(Boolean)
          .sort((a, b) => a.x - b.x);

        setHistory(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (token) {
      axios
        .get(`${API_BASE_URL}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPortfolioData(res.data))
        .catch(console.error);
    }
  }, [symbol, token]);

  const currentFund = useMemo(
    () => getFundFromPortfolio(portfolioData, symbol),
    [portfolioData, symbol],
  );

  const currentUnits = Number(currentFund?.units ?? 0);
  const hasUnits = currentUnits > 0;

  useEffect(() => {
    const backendActive = currentFund?.active ?? currentFund?.sipActive;

    if (typeof backendActive === "boolean") {
      setSipActive(backendActive);
    }

    if (hasUnits || backendActive) {
      setShowSipControls(true);
    } else {
      setShowSipControls(false);
      setSipMode("sip");
    }
  }, [currentFund?.active, currentFund?.sipActive, hasUnits]);

  const visibleHistory = useMemo(() => {
    if (!history.length) return [];
    if (selectedRange === "Max") return history;

    const opt = RANGE_OPTIONS.find((r) => r.label === selectedRange);
    if (!opt) return history;

    const latest = history.at(-1)?.x;
    if (!latest) return history;

    const cutoff = new Date(latest);
    cutoff.setDate(cutoff.getDate() - opt.days);

    return history.filter((h) => h.x >= cutoff);
  }, [history, selectedRange]);

  const latestPoint = history.at(-1);

  const chartData = {
    datasets: [
      {
        data: visibleHistory,
        parsing: { xAxisKey: "x", yAxisKey: "y" },
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.03)",
        fill: true,
        tension: 0.25,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "nearest", axis: "x", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: false,
        backgroundColor: "rgba(15,23,42,0.9)",
        callbacks: {
          label: (ctx) => `₹${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        grid: { color: "rgba(148,163,184,0.05)" },
        ticks: { color: "rgba(148,163,184,0.6)" },
      },
      y: {
        grid: { color: "rgba(148,163,184,0.05)" },
        ticks: { color: "rgba(148,163,184,0.6)" },
      },
    },
  };

  const isBusy = txState !== "idle";
  const showStartButton = !hasUnits && !showSipControls && !sipActive;

  const actionButtonLabel = useMemo(() => {
    if (sipMode === "sell") return "Sell Units";
    return sipActive ? "Stop" : "Invest";
  }, [sipMode, sipActive]);

  const actionButtonClass = useMemo(() => {
    if (sipMode === "sell") return "bg-amber-500 hover:bg-amber-400";
    return sipActive
      ? "bg-rose-500 hover:bg-rose-400"
      : "bg-emerald-500 hover:bg-emerald-400";
  }, [sipMode, sipActive]);

  const handleOpenSipControls = () => {
    setShowSipControls(true);
    setSipMode("sip");
    setTxMessage("");
    setTxState("idle");
  };

  const handleToggleMode = () => {
    if (!hasUnits) return;
    setSipMode((prev) => (prev === "sip" ? "sell" : "sip"));
    setTxMessage("");
    setTxState("idle");
  };

  const handlePrimaryAction = async () => {
    if (!token) return navigate("/signin");
    if (isBusy) return;

    if (sipMode === "sell") {
      const quantity = Number(sellUnits);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        setTxState("error");
        setTxMessage("Enter a valid unit quantity");
        return;
      }

      if (hasUnits && quantity > currentUnits) {
        setTxState("error");
        setTxMessage("You do not own that many units");
        return;
      }

      setTxState("processing");
      setTxMessage("Processing sell order...");
      await sleep(900);

      try {
        const res = await axios.patch(
          `${API_BASE_URL}/portfolio/${symbol}`,
          { type: "SELL", quantity },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setPortfolioData(res.data);
        setTxState("success");
        setTxMessage("Units sold ✔");

        const nextFund = getFundFromPortfolio(res.data, symbol);
        const nextUnits = Number(nextFund?.units ?? currentUnits);

        setSellUnits("");
        setSipMode("sip");

        if (!nextUnits) {
          setShowSipControls(false);
        }

        await sleep(1200);
      } catch (err) {
        setTxState("error");
        setTxMessage(err.response?.data?.message || "Sell failed ✖");
        await sleep(1200);
      }

      setTxState("idle");
      setTxMessage("");
      return;
    }

    if (!sipActive) {
      const amount = Number(sipAmount);

      if (!Number.isFinite(amount) || amount < 100) {
        setTxState("error");
        setTxMessage("SIP amount must be at least ₹100");
        return;
      }

      setTxState("processing");
      setTxMessage("Starting SIP and deducting first installment...");
      await sleep(900);

      try {
        const res = await axios.patch(
          `${API_BASE_URL}/portfolio/${symbol}`,
          {
            type: "BUY",
            sip: amount,
            active: true,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setPortfolioData(res.data);
        setSipActive(true);
        setShowSipControls(true);
        setSipMode("sip");
        setSellUnits("");
        setTxState("success");
        setTxMessage("SIP started ✔");
        await sleep(1200);
      } catch (err) {
        setTxState("error");
        setTxMessage(err.response?.data?.message || "SIP start failed ✖");
        await sleep(1200);
      }

      setTxState("idle");
      setTxMessage("");
      return;
    }

    setTxState("processing");
    setTxMessage("Stopping SIP...");
    await sleep(700);

    try {
      await axios.patch(
        `${API_BASE_URL}/portfolio/${symbol}`,
        {
          isStopped: true,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSipActive(false);
      setSipMode("sip");

      setTxState("success");
      setTxMessage("SIP stopped ✔");

      if (!hasUnits) {
        setShowSipControls(false);
        setSipActive(false);
        setSipMode("sip");
        setSipAmount("");
        setSellUnits("");
        localStorage.removeItem(storageKey);
      }

      await sleep(1200);
    } catch (err) {
      setTxState("error");
      setTxMessage(err.response?.data?.message || "Stop failed ✖");
      await sleep(1200);
    }

    setTxState("idle");
    setTxMessage("");
  };

  const sellQuantity = Number(sellUnits);

  const primaryDisabled =
    isBusy ||
    (sipMode === "sell"
      ? !sellUnits ||
        !Number.isFinite(sellQuantity) ||
        sellQuantity <= 0 ||
        sellQuantity > currentUnits ||
        !hasUnits
      : !sipActive && (!sipAmount || Number(sipAmount) < 100));

  return (
    <div className="min-h-screen spg bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />

      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(300px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(34,211,238,0.12), transparent 80%)`,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-300">
            {fundMeta?.["Scheme Name"] || "Fund Details"}
          </h1>
          <p className="text-slate-400 text-sm">Scheme Code: {symbol}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-slate-400">Latest NAV</p>
            <p className="text-cyan-300 font-semibold">
              {latestPoint ? `₹${latestPoint.y}` : "N/A"}
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-slate-400">Units</p>
            <p>
              {Number(currentUnits || 0)
                .toFixed(2)
                .replace(/\.00$/, "")}
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-slate-400">Budget</p>
            <p>₹{portfolioData?.remainingBalance?.toFixed(2) || 0}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-slate-400">Status</p>
            <p
              className={
                txState === "success"
                  ? "text-emerald-400"
                  : txState === "error"
                    ? "text-red-400"
                    : "text-slate-300"
              }
            >
              {txMessage || (sipActive ? "SIP active" : "Idle")}
            </p>
          </div>
        </div>

        {showStartButton && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenSipControls}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition"
            >
              Start a SIP
            </button>

            <span
              title="A Systematic Investment Plan (SIP) lets you invest a fixed amount into a mutual fund at regular intervals, such as monthly. It helps you invest consistently and can reduce the impact of market fluctuations over time."
              className="cursor-help text-cyan-400 text-lg font-bold"
            >
              ⓘ
            </span>
          </div>
        )}

        {(showSipControls || hasUnits || sipActive) && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {sipMode === "sell" ? "Sell Units" : "SIP Investment"}
                </h2>
                <p className="text-xs text-slate-400">
                  {sipMode === "sell"
                    ? "Enter the number of units you want to sell."
                    : sipActive
                      ? "Your SIP is active. Stop it anytime."
                      : "Enter your monthly SIP amount and invest."}
                </p>
              </div>

              <div
                className={`text-xs px-3 py-1 rounded-full border ${
                  sipActive
                    ? "border-emerald-400/30 text-emerald-300 bg-emerald-500/10"
                    : "border-slate-500/30 text-slate-300 bg-white/5"
                }`}
              >
                {sipActive ? "SIP Running" : "SIP Stopped"}
              </div>
              {sipActive && sipData?.isActive && sipData?.nextdate && (
                <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3">
                  <p className="text-xs text-slate-400">Next SIP Payment</p>
                  <p className="text-cyan-300 font-semibold">
                    {new Date(sipData.nextdate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {sipMode === "sip" ? (
                <input
                  type="text"
                  inputMode="decimal"
                  value={sipAmount}
                  onChange={(e) =>
                    setSipAmount(sanitizeDecimalInput(e.target.value))
                  }
                  placeholder="Enter SIP amount (min ₹100)"
                  className="w-full md:w-80 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-cyan-400"
                />
              ) : (
                <>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={sellUnits}
                    onChange={(e) =>
                      setSellUnits(sanitizeDecimalInput(e.target.value))
                    }
                    placeholder="Enter units to sell"
                    className={`w-full md:w-80 px-4 py-3 bg-slate-800 rounded-xl outline-none ${
                      Number(sellUnits) > currentUnits
                        ? "border border-red-500"
                        : "border border-slate-700 focus:border-cyan-400"
                    }`}
                  />

                  {Number(sellUnits) > currentUnits && (
                    <p className="text-red-400 text-sm">
                      You only own {currentUnits.toFixed(3)} units.
                    </p>
                  )}
                </>
              )}

              <button
                disabled={primaryDisabled}
                onClick={handlePrimaryAction}
                className={`w-full md:w-auto px-5 py-3 rounded-xl font-semibold transition ${
                  primaryDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : actionButtonClass
                }`}
              >
                {actionButtonLabel}
              </button>

              <button
                disabled={!hasUnits || isBusy}
                onClick={handleToggleMode}
                className={`w-full md:w-auto px-5 py-3 rounded-xl font-semibold transition border ${
                  !hasUnits || isBusy
                    ? "opacity-40 cursor-not-allowed border-slate-700 text-slate-400"
                    : "border-white/10 bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                {sipMode === "sell" ? "Back to SIP" : "Sell Units"}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {sipMode === "sell"
                ? "Decimals are allowed for units."
                : "SIP amount must be ₹100 or more."}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedRange(range.label)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRange === range.label
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="h-[300px] sm:h-[360px] md:h-[420px] bg-white/5 border border-white/10 rounded-xl p-4">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Loading chart data...
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>

        <p className="text-xs text-slate-500">
          Points loaded: {history.length}
        </p>
      </div>
    </div>
  );
}
