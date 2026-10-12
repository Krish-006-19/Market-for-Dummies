# Market for Dummies — Frontend

A React + Vite single-page app for a mutual-fund paper-trading simulator aimed at beginner investors. It lets users sign up, browse and trade mutual funds with virtual money, run simulated SIPs, track P/L, compete on a leaderboard, and learn the basics through a curated lesson list — fully responsive across mobile, tablet, and desktop.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Charts | Chart.js + `react-chartjs-2` + `chartjs-adapter-date-fns` |
| HTTP | Axios |
| State | React Context API (Auth, Stock selection, cursor-glow effect) |
| Linting | ESLint 9 |

---

## Core Features

### 1. Authentication (`Features/Signin.jsx` + `contextAPI/Authcontext.jsx`)
- Combined sign-in / register form with client-side validation (email format, username length, 6-char minimum password).
- JWT is stored in a cookie (not `localStorage`), with an in-memory auto-logout timer that fires ~1 minute before token expiry and redirects to `/signin`.
- On app load, the saved token is checked for expiry before being trusted, so an expired token can't leave the UI in a falsely "logged in" state.
- `AuthContext` exposes `login`, `register`, `logout`, `isAuthenticated`, and `authReady` (so route guards can wait for auth state to initialize before deciding whether to redirect).

### 2. Protected Routing (`components/RequireAuth.jsx`)
- Wraps `/portfolio`, `/lessons`, `/trade-history`, `/leaderboard`, and `/trade/stockinfo/:symbol` — unauthenticated users are redirected to `/signin` with the original destination preserved, so they land back where they intended after logging in.

### 3. Fund Browser (`Features/Trade.jsx`)
- Fetches the live tracked fund universe from the backend and groups funds into collapsible categories (Flexi Cap, Large/Large&Mid Cap, Mid Cap, Hybrid schemes, Index Funds).
- Live search by scheme code or fund name, filtered client-side across all categories simultaneously.
- Clicking a fund row navigates to its detail/trade page.

### 4. Fund Detail, Charting & Trade Execution (`Features/StockInfo.jsx`)
The most complex page in the app:
- Fetches fund metadata and historical NAV data in parallel, with selectable time ranges (1M / 2M / 6M / 1Yr / 2Yr / 5Yr / Max).
- Renders an interactive NAV line chart (Chart.js) with a custom highlight-marker plugin on hover.
- **Buy flow**: start a SIP by entering an amount (min ₹100); calls `PATCH /portfolio/:schemeCode` with `{ type: "BUY", sip, active: true }`.
- **Sell flow**: toggle into sell mode to liquidate units the user currently holds, with client-side validation against units actually owned before the request is sent.
- **Stop SIP**: deactivate a running SIP without selling the underlying holding.
- UI state (whether SIP controls are expanded, last-used mode/amounts) is persisted per-symbol in `localStorage` so returning to a fund's page restores the user's last context.
- Action buttons are full-width on mobile with a responsive chart height.

### 5. Portfolio Dashboard (`Features/Portfolio.jsx`)
- Summary cards: current cash balance, total invested, total units held.
- Holdings table with per-fund NAV, invested amount, current value, and color-coded profit/loss — all computed server-side and just rendered here.

### 6. Trade History (`Features/TradeHistory.jsx`)
- Full trade log fetched from the backend, with a client-side Buy/Sell/All filter and a running total of filtered trade value.

### 7. Leaderboard (`Features/Leaderboard.jsx`)
- Authenticated fetch of top-10 portfolios by total net worth.
- Derives a return percentage per user against a fixed starting balance and renders summary cards (top trader, active trader count, combined portfolio value) plus a full sortable-by-rank table.

### 8. Lessons (`Features/Lessons.jsx`)
- Curated table of 20 beginner-friendly mutual fund education videos (YouTube links).
- Per-lesson "completed" checkbox state persisted in `localStorage`, independent of login state.

### 9. Navigation (`components/Navbar.jsx`)
- Responsive nav bar: full link row + profile dropdown on desktop, hamburger menu with a slide-down panel on mobile/tablet (the app was previously unusable on small screens before this was added).
- Closes automatically when resizing back to desktop width.
- Profile menu includes **Logout** and **Delete Account**, the latter behind a confirmation modal (rather than firing immediately) that clearly states the action is irreversible and what it deletes.

### 10. Global UX touches
- A custom radial cursor-glow effect (`contextAPI/Cursorcontext.jsx`) follows the pointer across pages for visual polish.
- Consistent glassmorphism-style design language (backdrop blur, gradient text/buttons) and dark-mode-aware classes throughout.
- Responsive padding, scaled headings, and stacked CTAs on mobile across all feature pages.

---

## Architecture

```
src/
  Features/        One component per page/route (Homepage, Trade, StockInfo,
                    Portfolio, TradeHistory, Leaderboard, Lessons, Signin)
  components/       Shared UI (Navbar, RequireAuth route guard)
  contextAPI/       React Context providers (Auth, Stock selection, Cursor glow)
  lib/api.js        API base URL, cookie helpers, JWT expiry check
  App.jsx           Route definitions
  main.jsx          Provider tree + app bootstrap
```

### Auth token lifecycle
1. `login()`/`register()` call the backend and store the returned JWT via `AuthContext`.
2. The token is written to a cookie and set as the default `Authorization` header for all subsequent Axios requests.
3. A timer is scheduled to auto-clear auth state ~1 minute before the token's `exp` claim.
4. On reload, the cookie is re-validated for expiry before being trusted again.

---

## API Integration

All requests go through `VITE_API_URL` (set via environment variable) and were explicitly audited against the backend's actual routes and payload shapes to fix several mismatches found during development:

| Frontend action | Backend call |
|---|---|
| Register / Login | `POST /user/register`, `POST /user/login` |
| Delete account | `DELETE /user/delete` |
| Browse funds | `GET /` |
| Fund detail + history | `GET /:schemeCode`, `GET /history/:schemeCode` |
| Buy / start SIP | `PATCH /portfolio/:schemeCode` `{ type: "BUY", sip, active: true }` |
| Sell | `PATCH /portfolio/:schemeCode` `{ type: "SELL", quantity }` |
| Stop SIP | `PATCH /portfolio/:schemeCode` `{ isStopped: true, schemeCode }` |
| Portfolio | `GET /portfolio` |
| Trade history | `GET /trade` |
| Leaderboard | `GET /leaderboard` |

Notable fixes made during the audit: the BUY payload originally sent `{ quantity }` (wrong shape — the backend expects `{ sip, active }`), the Leaderboard component wasn't sending its Authorization header, Trade History was reading the wrong response field (`amount` vs. an earlier mismatched key), and a broken call to a `/user/update` endpoint that doesn't exist on the backend was removed.

---

## Environment Variables

```
VITE_API_URL=    # Base URL of the backend API
```

## Running Locally

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint      # ESLint
```

## Known Housekeeping
- `@reduxjs/toolkit` and `react-redux` are listed as dependencies but are not currently used anywhere in the codebase (state is handled via Context). Safe to remove if not planned for future use, to keep the bundle and dependency tree lean.
