import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contextAPI/Authcontext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import Navbar from "../components/Navbar";

/*
 * Keep rupee values as scaled integers instead of adding JavaScript floats.
 * 8 decimal places retain sub-paise valuation precision during calculations;
 * currency is rounded to paise only when displayed.
 */
const MONEY_SCALE = 8;
const UNIT_SCALE = 8;
const SCALE_FACTOR = 10n ** BigInt(MONEY_SCALE);
const PAISE_FACTOR = SCALE_FACTOR / 100n;
const STARTING_BALANCE = 10_000n * SCALE_FACTOR;
const integerFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** Convert a decimal number/string to a fixed-point BigInt, rounding half-up. */
function toScaledInt(value, scale = MONEY_SCALE) {
  if (value === null || value === undefined || value === "") return 0n;

  const source = String(value).trim();
  const match = source.match(/^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);
  if (!match || (!match[2] && !match[3])) return 0n;

  const sign = match[1] === "-" ? -1n : 1n;
  const integerPart = match[2] || "0";
  const fractionPart = match[3] || "";
  const exponent = Number(match[4] || 0);

  // Guard against malformed or unreasonable API values causing huge BigInts.
  if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 1000) return 0n;

  const digits = BigInt(`${integerPart}${fractionPart}` || "0");
  const shift = scale - fractionPart.length + exponent;
  let scaled;

  if (shift >= 0) {
    scaled = digits * 10n ** BigInt(shift);
  } else {
    const divisor = 10n ** BigInt(-shift);
    const quotient = digits / divisor;
    const remainder = digits % divisor;
    scaled = quotient + (remainder * 2n >= divisor ? 1n : 0n);
  }

  return sign * scaled;
}

function divideRoundHalfUp(numerator, denominator) {
  if (denominator === 0n) return 0n;

  const negative = (numerator < 0n) !== (denominator < 0n);
  const absoluteNumerator = numerator < 0n ? -numerator : numerator;
  const absoluteDenominator = denominator < 0n ? -denominator : denominator;
  const quotient = absoluteNumerator / absoluteDenominator;
  const remainder = absoluteNumerator % absoluteDenominator;
  const rounded = quotient + (remainder * 2n >= absoluteDenominator ? 1n : 0n);

  return negative ? -rounded : rounded;
}

function absolute(value) {
  return value < 0n ? -value : value;
}

function formatPaise(paise) {
  const negative = paise < 0n;
  const value = absolute(paise);
  const rupees = value / 100n;
  const fraction = (value % 100n).toString().padStart(2, "0");

  return `${negative ? "−" : ""}₹${integerFormatter.format(rupees)}.${fraction}`;
}

function formatMoneyScaled(amountScaled) {
  return formatPaise(divideRoundHalfUp(amountScaled, PAISE_FACTOR));
}

/** Expand a decimal/exponent string without converting it through Number arithmetic. */
function decimalParts(value, minimumFractionDigits = 2) {
  const source = String(value ?? 0).trim();
  const match = source.match(/^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);

  if (!match || (!match[2] && !match[3])) {
    return { negative: false, integer: "0", fraction: "00" };
  }

  const negative = match[1] === "-";
  const originalInteger = match[2] || "0";
  const originalFraction = match[3] || "";
  const exponent = Number(match[4] || 0);
  if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 1000) {
    return { negative: false, integer: "0", fraction: "00" };
  }

  const digits = `${originalInteger}${originalFraction}` || "0";
  const decimalPoint = originalInteger.length + exponent;
  let integer;
  let fraction;

  if (decimalPoint <= 0) {
    integer = "0";
    fraction = `${"0".repeat(-decimalPoint)}${digits}`;
  } else if (decimalPoint >= digits.length) {
    integer = `${digits}${"0".repeat(decimalPoint - digits.length)}`;
    fraction = "";
  } else {
    integer = digits.slice(0, decimalPoint);
    fraction = digits.slice(decimalPoint);
  }

  integer = (integer || "0").replace(/^0+(?=\d)/, "");
  fraction = fraction.replace(/0+$/, "");
  fraction = fraction.padEnd(minimumFractionDigits, "0");

  return { negative, integer, fraction };
}

/** NAV is not a currency balance: preserve its supplied decimals instead of forcing 2. */
function formatNav(value) {
  const { negative, integer, fraction } = decimalParts(value, 2);
  return `${negative ? "−" : ""}₹${integerFormatter.format(BigInt(integer))}.${fraction}`;
}

/** Format a scaled quantity without using floating-point summation or 5-digit rounding. */
function formatUnits(unitsScaled) {
  const negative = unitsScaled < 0n;
  const value = absolute(unitsScaled);
  const factor = 10n ** BigInt(UNIT_SCALE);
  const whole = value / factor;
  const fraction = (value % factor).toString().padStart(UNIT_SCALE, "0").replace(/0+$/, "");

  return `${negative ? "−" : ""}${integerFormatter.format(whole)}${fraction ? `.${fraction}` : ""}`;
}

function formatPercentHundredths(value) {
  const negative = value < 0n;
  const absoluteValue = absolute(value);
  const whole = absoluteValue / 100n;
  const fraction = (absoluteValue % 100n).toString().padStart(2, "0");
  return `${negative ? "−" : ""}${whole}.${fraction}`;
}

function Portfolio() {
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

    let cancelled = false;

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_BASE_URL}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setPortfolio(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error ||
              "We couldn't load your portfolio. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPortfolio();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  const funds = useMemo(() => portfolio?.funds || [], [portfolio?.funds]);

  const totalInvested = useMemo(
    () => funds.reduce((sum, fund) => sum + toScaledInt(fund.investedValue), 0n),
    [funds],
  );

  const holdingsValue = useMemo(
    () =>
      funds.reduce(
        (sum, fund) =>
          sum + toScaledInt(fund.currentValue ?? fund.investedValue ?? 0),
        0n,
      ),
    [funds],
  );

  const totalUnits = useMemo(
    () =>
      funds.reduce(
        (sum, fund) => sum + toScaledInt(fund.units, UNIT_SCALE),
        0n,
      ),
    [funds],
  );

  const virtualBalance = toScaledInt(portfolio?.remainingBalance ?? 0);
  const accountValue = holdingsValue + virtualBalance;
  const totalPnl = accountValue - STARTING_BALANCE;

  // Percent rounded to 2 decimal places using integer arithmetic.
  const returnPercentHundredths = divideRoundHalfUp(
    totalPnl * 10_000n,
    STARTING_BALANCE,
  );

  return (
    <div className="mfd-page">
      <Navbar />
      <main className="page-container page-content">
        <div className="page-header">
          <div>
            <span className="eyebrow">Your learning account</span>
            <h1>My portfolio</h1>
            <p>
              Track your practice holdings, invested amount and remaining virtual balance in one place. On every transaction, some minimal trade charges are applied based on platform currency
            </p>
          </div>
          <Link to="/trade" className="primary-button">
            Explore funds <span>↗</span>
          </Link>
        </div>

        {loading ? (
          <div className="surface loading-state">Loading portfolio details…</div>
        ) : error ? (
          <div className="surface surface-pad">
            <div className="status-message status-error">{error}</div>
            <button
              className="secondary-button"
              style={{ marginTop: 14 }}
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <section className="portfolio-overview surface">
              <div className="portfolio-overview-main">
                <span className="portfolio-overview-label">
                  Total practice account value
                </span>
                <strong>{formatMoneyScaled(accountValue)}</strong>
                <span
                  className={`portfolio-pnl ${totalPnl >= 0n ? "text-positive" : "text-negative"}`}
                >
                  {totalPnl >= 0n ? "+" : "−"}
                  {formatMoneyScaled(absolute(totalPnl))} (
                  {returnPercentHundredths >= 0n ? "+" : ""}
                  {formatPercentHundredths(returnPercentHundredths)}%)
                  <small> practice performance</small>
                </span>
              </div>
              <div className="portfolio-overview-side">
                <span>Available virtual balance</span>
                <strong>{formatMoneyScaled(virtualBalance)}</strong>
                <Link className="inline-link" to="/trade">
                  Find a fund to practice with →
                </Link>
              </div>
            </section>

            <div className="metric-grid portfolio-metrics">
              <article className="metric-card">
                <span className="metric-label">Amount invested</span>
                <strong className="metric-value">
                  {formatMoneyScaled(totalInvested)}
                </strong>
                <span className="metric-note">
                  Across {funds.length} fund{funds.length === 1 ? "" : "s"}
                </span>
              </article>

              <article className="metric-card">
                <span className="metric-label">Total units held</span>
                <strong className="metric-value">{formatUnits(totalUnits)}</strong>
                <span className="metric-note">
                  Units purchased in your practice account
                </span>
              </article>

              <article className="metric-card">
                <span className="metric-label">Net practice P/L</span>
                <strong
                  className={`metric-value ${totalPnl >= 0n ? "text-positive" : "text-negative"}`}
                >
                  {totalPnl >= 0n ? "+" : "−"}
                  {formatMoneyScaled(absolute(totalPnl))}
                </strong>
                <span className="metric-note">
                  Account value minus your ₹10,000 starting balance
                </span>
              </article>
            </div>

            <section className="surface holdings-surface">
              <div className="holdings-heading">
                <div>
                  <h2 className="surface-title">Your holdings</h2>
                  <p className="surface-subtitle">
                    Each row represents a mutual fund in your paper portfolio.
                  </p>
                </div>
                <span className="tag tag-neutral">
                  {funds.length} holding{funds.length === 1 ? "" : "s"}
                </span>
              </div>

              {!funds.length ? (
                <div className="empty-state">
                  <div className="empty-icon">↗</div>
                  <h3>Your portfolio is ready when you are</h3>
                  <p>
                    You have not added any funds yet. Explore schemes, review
                    their NAV and make your first paper investment.
                  </p>
                  <Link to="/trade" className="primary-button">
                    Explore mutual funds <span>→</span>
                  </Link>
                </div>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fund / scheme code</th>
                        <th>Units</th>
                        <th>NAV</th>
                        <th>Invested</th>
                        <th>Current value</th>
                        <th>Unrealised P/L</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {funds.map((fund, index) => {
                        const investedScaled = toScaledInt(fund.investedValue ?? 0);
                        const currentScaled = toScaledInt(
                          fund.currentValue ?? fund.investedValue ?? 0,
                        );
                        // Compute P/L from the same exact values shown in this row.
                        const pnlScaled = currentScaled - investedScaled;
                        const unitsScaled = toScaledInt(fund.units, UNIT_SCALE);

                        return (
                          <tr key={`${fund.symbol || "fund"}-${index}`}>
                            <td>
                              <div className="fund-table-name">
                                <span className="fund-monogram fund-monogram-green">
                                  {String(fund.symbol || "M")
                                    .slice(0, 1)
                                    .toUpperCase()}
                                </span>
                                <span>
                                  <strong>{fund.symbol || "Mutual fund"}</strong>
                                  <small>Scheme {fund.symbol || "—"}</small>
                                </span>
                              </div>
                            </td>
                            <td className="number-cell">{formatUnits(unitsScaled)}</td>
                            <td className="number-cell">{formatNav(fund.nav)}</td>
                            <td className="number-cell">
                              {formatMoneyScaled(investedScaled)}
                            </td>
                            <td className="number-cell">
                              {formatMoneyScaled(currentScaled)}
                            </td>
                            <td
                              className={`number-cell ${pnlScaled >= 0n ? "text-positive" : "text-negative"}`}
                            >
                              {pnlScaled >= 0n ? "+" : "−"}
                              {formatMoneyScaled(absolute(pnlScaled))}
                            </td>
                            <td>
                              <Link
                                to={`/trade/stockinfo/${fund.symbol}`}
                                className="table-action-link"
                              >
                                Details →
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <p className="disclaimer-note">
              All transactions on MFD are simulated for learning purposes.
              Values shown are based on available scheme NAV data and are not a
              statement of a real investment account.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default Portfolio;
