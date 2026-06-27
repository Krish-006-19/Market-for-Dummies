export const API_BASE_URL = "https://mutual-funds-1.onrender.com";

/* ================= Cookies ================= */

export const setCookie = (name, value, hours = 1) => {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
};

export const getCookie = (name) => {
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    const [k, v] = c.trim().split("=");
    if (k === name) return v;
  }
  return null;
};

export const removeCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/* backward compatibility (fixes your current crashes) */
export const deleteCookie = removeCookie;

/* ================= Auth ================= */

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};