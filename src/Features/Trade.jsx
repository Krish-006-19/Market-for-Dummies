import { useContext, useEffect, useMemo, useState } from "react";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

const BASE_API = API_BASE_URL;

const CATEGORY_GROUPS = [
  {
    key: "flexi-cap",
    title: "Equity Scheme - Flexi Cap Fund",
    categories: [
      "Equity Scheme - Flexi Cap Fund",
      "Equity Schemes - Flexi Cap Fund",
    ],
  },
  {
    key: "large-cap",
    title: "Equity Scheme - Large Cap / Large & Mid Cap Fund",
    categories: [
      "Equity Scheme - Large Cap Fund",
      "Equity Schemes - Large Cap Fund",
      "Equity Scheme - Large & Mid Cap Fund",
      "Equity Schemes - Large & Mid Cap Fund",
    ],
  },
  {
    key: "mid-cap",
    title: "Equity Scheme - Mid Cap Fund",
    categories: [
      "Equity Scheme - Mid Cap Fund",
      "Equity Schemes - Mid Cap Fund",
    ],
  },
  {
    key: "hybrid",
    title: "Hybrid Schemes",
    categories: [
      "Hybrid Scheme - Aggressive Hybrid Fund",
      "Hybrid Schemes - Aggressive Hybrid Fund",
      "Hybrid Scheme - Arbitrage Fund",
      "Hybrid Schemes - Arbitrage Fund",
      "Hybrid Scheme - Conservative Hybrid Fund",
      "Hybrid Schemes - Conservative Hybrid Fund",
      "Hybrid Scheme - Dynamic Asset Allocation or Balanced Advantage",
      "Hybrid Schemes - Dynamic Asset Allocation or Balanced Advantage",
      "Hybrid Scheme - Equity Savings",
      "Hybrid Schemes - Equity Savings",
    ],
  },
  {
    key: "index",
    title: "Other Scheme - Index Funds",
    categories: [
      "Other Scheme - Index Funds",
      "Index Funds - Equity Funds",
    ],
  },
];

function Trade() {
  const { cursorPos } = useContext(CursorContext);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGroup, setOpenGroup] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await fetch(`${BASE_API}/`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setFunds(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  const filteredFunds = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return funds;
    }

    return funds.filter((fund) => {
      const code = String(fund["Scheme Code"] || "").toLowerCase();
      const name = String(fund["Scheme Name"] || "").toLowerCase();

      return code.includes(query) || name.includes(query);
    });
  }, [funds, search]);
  const categoryToGroup = useMemo(() => {
    const map = new Map();

    for (const group of CATEGORY_GROUPS) {
      for (const category of group.categories) {
        map.set(category, group.key);
      }
    }

    return map;
  }, []);

  const groupedFunds = useMemo(() => {
    const map = Object.fromEntries(
      CATEGORY_GROUPS.map((group) => [group.key, []])
    );

    for (const fund of filteredFunds) {
      const groupKey = categoryToGroup.get(fund.category);

      if (groupKey) {
        map[groupKey].push(fund);
      }
    }

    return map;
  }, [filteredFunds, categoryToGroup]);

  const handleRowClick = (code) => {
    navigate(`/trade/stockinfo/${code}`);
  };

  const toggleGroup = (key) => {
    setOpenGroup((prev) => (prev === key ? null : key));
  };

  return (
    <div className="relative min-h-screen spg overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 font-sans transition duration-500">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(
            200px circle at ${cursorPos.x}px ${cursorPos.y}px,
            rgba(59,130,246,0.25),
            transparent 80%
          )`,
        }}
      />

      <Navbar />

      <main className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h2 className="text-2xl font-bold mb-4">All Mutual Fund Types</h2>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scheme code or fund name..."
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : funds.length === 0 ? (
          <p className="text-center text-gray-500">No funds found.</p>
        ) : (
          <div className="space-y-5">
            {CATEGORY_GROUPS.map((group) => {
              const list = groupedFunds[group.key] || [];
              const isOpen = openGroup === group.key;

              return (
                <div
                  key={group.key}
                  className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">
                        {group.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {list.length} fund
                        {list.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {isOpen ? "Hide" : "Show"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="overflow-x-auto border-t border-gray-200 dark:border-slate-700">
                      {list.length === 0 ? (
                        <p className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                          No funds found in this category.
                        </p>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                          <thead className="bg-gray-100 dark:bg-slate-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold">
                                Scheme Code
                              </th>

                              <th className="px-4 py-3 text-left text-sm font-semibold">
                                Scheme Name
                              </th>

                              <th className="px-4 py-3 text-left text-sm font-semibold">
                                Net Asset Value
                              </th>

                              <th className="px-4 py-3 text-left text-sm font-semibold">
                                Date
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {list.map((fund) => (
                              <tr
                                key={fund["Scheme Code"]}
                                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-700 transition"
                                onClick={() =>
                                  handleRowClick(fund["Scheme Code"])
                                }
                              >
                                <td className="px-4 py-2 text-sm">
                                  {fund["Scheme Code"]}
                                </td>

                                <td className="py-2 text-sm">
                                  {fund["Scheme Name"]}
                                </td>

                                <td className="px-2 py-2 text-sm font-medium text-green-600 dark:text-green-400">
                                  ₹{fund["Net Asset Value"]}
                                </td>

                                <td className="px-6 py-2 text-xs">
                                  {fund["Date"]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Trade;
