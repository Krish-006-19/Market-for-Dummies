import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";

import {
  API_BASE_URL,
  setCookie,
  getCookie,
  removeCookie,
  isTokenExpired,
} from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /* ================= STATE ================= */

  const [token, setToken] = useState(() => {
    const savedToken = getCookie("token");
    return savedToken && !isTokenExpired(savedToken) ? savedToken : null;
  });

  const [userId, setUserId] = useState(() => getCookie("userId") || null);
  const [authReady, setAuthReady] = useState(false);

  // Ref to hold the navigate function injected from outside (set by App)
  const navigateRef = useRef(null);

  /* ================= HELPERS ================= */

  const clearAuth = (redirect = true) => {
    setToken(null);
    setUserId(null);
    removeCookie("token");
    removeCookie("userId");
    axios.defaults.headers.common.Authorization = "";
    if (redirect && navigateRef.current) {
      navigateRef.current("/signin", { replace: true });
    }
  };

  const getExpiryMs = (jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      return payload?.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  };

  /* ================= TOKEN EFFECT ================= */

  useEffect(() => {
    if (!token) {
      clearAuth(false); // already logged out, don't redirect in effect
      return;
    }

    const expiryMs = getExpiryMs(token);

    // persist cookie (fallback 1h)
    setCookie("token", token, 1);

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const refreshLeadMs = 60_000;
    let timerId = null;

    if (expiryMs) {
      const logoutAt = Math.max(expiryMs - Date.now() - refreshLeadMs, 0);

      timerId = window.setTimeout(() => {
        clearAuth(true); // redirect to /signin when token expires
      }, logoutAt);
    }

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ================= USER EFFECT ================= */

  useEffect(() => {
    if (!userId) {
      removeCookie("userId");
      return;
    }

    setCookie("userId", userId, 1);
  }, [userId]);

  /* ================= INIT LOAD ================= */

  useEffect(() => {
    const savedToken = getCookie("token");
    const savedUserId = getCookie("userId");

    if (savedToken && isTokenExpired(savedToken)) {
      clearAuth(false);
    } else {
      if (savedToken && savedToken !== token) setToken(savedToken);
      if (savedUserId && savedUserId !== userId) setUserId(savedUserId);
    }

    setAuthReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= AUTH FUNCTIONS ================= */

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password,
      });

      if (res.data?.accessToken) {
        setToken(res.data.accessToken);
        setUserId(res.data.userId);

        return {
          success: true,
          userId: res.data.userId,
        };
      }

      return { success: false, message: "Login failed." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Login failed.",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/user/register`, {
        username,
        email,
        password,
      });

      return {
        success: true,
        message: res.data?.message || "Registration successful",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Registration failed.",
      };
    }
  };

  const logout = () => {
    clearAuth(false); // caller (Navbar) handles navigation
    setToken(null);
    setUserId(null);
  };

  /* ================= MEMO ================= */

  const isAuthenticated = useMemo(() => {
    return Boolean(token) && !isTokenExpired(token);
  }, [token]);

  /* ================= PROVIDER ================= */

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated,
        authReady,
        navigateRef,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
