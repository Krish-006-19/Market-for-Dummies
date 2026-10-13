# MFD frontend refresh

This refresh gives Market for Dummies a consistent mutual-fund learning product interface rather than a neon trading-game appearance.

## What changed

- Rebuilt the public landing page around mutual-fund education, paper trading and a clearly labelled illustrative dashboard preview.
- Reworked navigation, account menu, mobile navigation and account-deletion confirmation.
- Rebuilt sign-in and registration layouts while retaining email verification and existing authentication handlers.
- Reworked portfolio, fund explorer, transaction history, learning centre and leaderboard screens.
- Restyled the fund details page while retaining the existing NAV history chart, SIP actions and monthly holdings data.
- Added responsive layouts, calmer green financial-product styling, consistent tables/cards/forms, clearer empty/error/loading states, accessible input labels, page metadata and a custom MFD favicon.
- Kept the current API base URL configuration in `.env`; existing API calls and route structure remain in place.

## Run locally

```bash
npm install
npm run dev
```

To check the production bundle:

```bash
npm run build
```

The project expects `VITE_API_URL` to point to the MFD backend. The current `.env` points to the configured Render API. All investing activity remains simulated; this UI is not a real brokerage interface or an investment recommendation service.
