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

  const [token, setToken] = useState(() => {
    const savedToken = getCookie("token");
    return savedToken && !isTokenExpired(savedToken) ? savedToken : null;
  });

  const [userId, setUserId] = useState(() => getCookie("userId") || null);
  const [authReady, setAuthReady] = useState(false);
  // Whether the backend wants email OTP verification at signup.
  // Defaults to true; the backend can switch it off with OTP_REQUIRED=false.
  const [otpRequired, setOtpRequired] = useState(true);

  const navigateRef = useRef(null);


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


  useEffect(() => {
    if (!token) {
      clearAuth(false);
      return;
    }

    const expiryMs = getExpiryMs(token);

    setCookie("token", token, 1);

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const refreshLeadMs = 60_000;
    let timerId = null;

    if (expiryMs) {
      const logoutAt = Math.max(expiryMs - Date.now() - refreshLeadMs, 0);

      timerId = window.setTimeout(() => {
        clearAuth(true);
      }, logoutAt);
    }

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [token]);


  useEffect(() => {
    if (!userId) {
      removeCookie("userId");
      return;
    }

    setCookie("userId", userId, 1);
  }, [userId]);


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
  }, []);


  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE_URL}/user/config`)
      .then((res) => {
        if (!cancelled && typeof res.data?.otpRequired === "boolean") {
          setOtpRequired(res.data.otpRequired);
        }
      })
      .catch(() => {
        // Keep the safe default (OTP required) if config can't be fetched.
      });
    return () => {
      cancelled = true;
    };
  }, []);


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

  const getOtp = async (email) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/user/getotp`, { email });

      return {
        success: true,
        message: res.data?.message || "OTP sent successfully",
        retryAfter: res.data?.retryAfter,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Could not send OTP.",
        retryAfter: err.response?.data?.retryAfter,
      };
    }
  };

  const register = async (username, email, password, userOTP) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/user/register`, {
        username,
        email,
        password,
        userOTP,
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
    clearAuth(false);
    setToken(null);
    setUserId(null);
  };

  const isAuthenticated = useMemo(() => {
    return Boolean(token) && !isTokenExpired(token);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated,
        authReady,
        navigateRef,
        otpRequired,
        login,
        getOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};