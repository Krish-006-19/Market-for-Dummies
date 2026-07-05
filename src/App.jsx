import { Routes, Route, BrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import "./App.css";

import { AuthContext } from "./contextAPI/Authcontext";

import Homepage from "./Features/Homepage";
import Lessons from "./Features/Lessons";
import Portfolio from "./Features/Portfolio";
import Signin from "./Features/Signin";
import Trade from "./Features/Trade";
import StockInfo from "./Features/StockInfo";
import Leaderboard from "./Features/Leaderboard";
import TradeHistory from "./Features/TradeHistory";
import RequireAuth from "./components/RequireAuth";

function NavigateInjector() {
  const navigate = useNavigate();
  const { navigateRef } = useContext(AuthContext);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate, navigateRef]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <NavigateInjector />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/trade" element={<Trade />} />
        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          }
        />

        <Route
          path="/portfolio"
          element={
            <RequireAuth>
              <Portfolio />
            </RequireAuth>
          }
        />
        <Route
          path="/lessons"
          element={
            <RequireAuth>
              <Lessons />
            </RequireAuth>
          }
        />
        <Route
          path="/trade-history"
          element={
            <RequireAuth>
              <TradeHistory />
            </RequireAuth>
          }
        />
        <Route
          path="/trade/stockinfo/:symbol"
          element={
            <RequireAuth>
              <StockInfo />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
