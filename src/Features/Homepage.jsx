import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  { number: "01", title: "Explore real fund data", text: "Browse mutual fund schemes and review NAV history before deciding what to practice with." },
  { number: "02", title: "Practice without pressure", text: "Start with a virtual balance and understand how fund units, NAV and SIPs work." },
  { number: "03", title: "Build investing fluency", text: "Track your holdings, review transactions and learn the language of long-term investing." },
];

function Homepage() {
  return <div className="mfd-page home-page">
    <Navbar />
    <main>
      <section className="home-hero page-container">
        <div className="home-hero-copy">
          <div className="hero-kicker"><span className="hero-kicker-dot" /> A practical introduction to mutual funds</div>
          <h1>Make your first investment decision <em>with confidence.</em></h1>
          <p className="hero-description">Understand mutual funds by exploring real scheme data, building a practice portfolio and learning at your own pace — without putting your money at risk.</p>
          <div className="hero-actions"><Link to="/trade" className="primary-button hero-primary">Explore mutual funds <span>↗</span></Link><Link to="/lessons" className="secondary-button hero-secondary">Start learning <span>→</span></Link></div>
          <div className="hero-proof"><span className="proof-check">✓</span><span>No real money involved</span><i /> <span>Built for first-time investors</span></div>
        </div>

        <div className="hero-preview" aria-label="Illustrative portfolio dashboard preview">
          <div className="preview-window-top"><div className="preview-brand"><span className="preview-brand-mark">m</span><span>Practice portfolio</span></div><span className="preview-pill"><i /> Demo account</span></div>
          <div className="preview-main">
            <div className="preview-label">Portfolio overview <span>↗</span></div>
            <div className="preview-value">₹10,000<span>.00</span></div>
            <div className="preview-caption">Starting practice balance</div>
            <div className="preview-chart">
              <div className="chart-grid-line line-one"/><div className="chart-grid-line line-two"/><div className="chart-grid-line line-three"/>
              <svg viewBox="0 0 480 132" preserveAspectRatio="none" role="img" aria-label="Illustrative portfolio line chart"><defs><linearGradient id="homeChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4b9c79" stopOpacity=".18"/><stop offset="100%" stopColor="#4b9c79" stopOpacity="0"/></linearGradient></defs><path d="M0 104 C25 100 30 81 57 87 S88 93 110 70 S152 88 174 62 S211 71 236 48 S275 57 296 40 S336 52 356 28 S399 53 420 20 S453 25 480 8 L480 132 L0 132 Z" fill="url(#homeChartFill)"/><path d="M0 104 C25 100 30 81 57 87 S88 93 110 70 S152 88 174 62 S211 71 236 48 S275 57 296 40 S336 52 356 28 S399 53 420 20 S453 25 480 8" fill="none" stroke="#2d815f" strokeWidth="3" strokeLinecap="round"/></svg>
            </div>
            <div className="preview-chart-labels"><span>Day 1</span><span>Practice over time</span><span>Today</span></div>
          </div>
          <div className="preview-holdings">
            <div className="preview-section-heading"><strong>My watchlist</strong><span>Illustrative data</span></div>
            <div className="preview-fund-row"><span className="fund-monogram fund-monogram-green">E</span><span className="preview-fund-copy"><strong>Equity funds</strong><small>Long-term growth</small></span><span className="preview-fund-range">Higher risk</span></div>
            <div className="preview-fund-row"><span className="fund-monogram fund-monogram-gold">B</span><span className="preview-fund-copy"><strong>Hybrid funds</strong><small>Mixed asset exposure</small></span><span className="preview-fund-range range-muted">Moderate risk</span></div>
          </div>
          <div className="preview-footnote"><span>ⓘ</span> Preview uses illustrative values — not investment advice.</div>
        </div>
      </section>

      <section className="home-trust-band"><div className="page-container trust-band-inner"><div><span className="trust-label">A safer way to start</span><strong>Learn the mechanics before risking real capital.</strong></div><div className="trust-stat"><strong>₹0</strong><span>real money required</span></div><div className="trust-stat"><strong>At your pace</strong><span>learn without pressure</span></div><div className="trust-stat"><strong>India-focused</strong><span>mutual fund context</span></div></div></section>

      <section className="home-how page-container" id="how-it-works"><div className="section-intro"><span className="eyebrow">A clearer first step</span><h2>Investing is a skill.<br/><em>Practice makes it familiar.</em></h2><p>Market for Dummies turns unfamiliar terms and decisions into a guided, hands-on learning experience.</p></div><div className="home-feature-grid">{features.map((item) => <article className="home-feature" key={item.number}><span className="feature-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>

      <section className="home-cta page-container"><div className="cta-panel"><div><span className="eyebrow eyebrow-light">Your first step starts here</span><h2>Explore the market.<br/>Make sense of the numbers.</h2><p>A learning environment for people who want to understand before they invest.</p></div><Link to="/trade" className="cta-link">Browse mutual funds <span>↗</span></Link><div className="cta-orbit cta-orbit-one"/><div className="cta-orbit cta-orbit-two"/></div></section>
    </main>
    <footer className="home-footer"><div className="page-container footer-inner"><Link className="brand-lockup" to="/"><span className="brand-symbol">m</span><span><span className="brand-name">Market for Dummies</span><span className="brand-caption">Learn. Practice. Invest.</span></span></Link><p>Educational paper-trading platform. Not a broker, financial adviser, or recommendation service.</p><span className="footer-copyright">© {new Date().getFullYear()} MFD</span></div></footer>
  </div>;
}

export default Homepage;
