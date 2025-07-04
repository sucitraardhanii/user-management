const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async ({ nippos, password, idaplikasi }) => {

  const res = await fetch(`${BASE_URL}/authMob`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nippos,
      password,
      idAplikasi: idaplikasi,
    }),
  });

  const data = await res.json();

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const html = await res.text();
    console.error("Response bukan JSON:", html);
    throw new Error("Server mengirim data bukan JSON");
  }

  if (!data.token) throw new Error("Token tidak ditemukan");

  saveToken(data.token, idaplikasi, nippos);
  return data.token;
};

export function saveToken(token, idaplikasi, nippos) {
  const now = new Date();
  const expiry = now.getTime() + 60 * 60 * 10000; // 10 jam
  const item = {
    token,
    idaplikasi,
    nippos,
    expiry,
  };
  localStorage.setItem("auth_token", JSON.stringify(item));
}

export function getToken() {
  if (typeof window === "undefined") return null;

  const itemStr = localStorage.getItem("auth_token");
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem("auth_token");
      return null;
    }

    return item.token;
  } catch (err) {
    localStorage.removeItem("auth_token");
    return null;
  }
}


export function isTokenExpired() {
  if (typeof window === "undefined") return true;

  const itemStr = localStorage.getItem("auth_token");
  if (!itemStr) return true;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    return now.getTime() > item.expiry;
  } catch (err) {
    return true;
  }
}

export function removeToken() {
  localStorage.removeItem("auth_token");
}

export const logout = () => {
  removeToken();
};


export const SUPER_ADMIN_APP_ID = "kkTF3FKfnK0sWExTZZquhw==";

export function getIdAplikasi() {
  if (typeof window === "undefined") return null;

  const itemStr = localStorage.getItem("auth_token");
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    return item.idaplikasi || null;
  } catch (err) {
    return null;
  }
}

export function isSuperAdmin() {
  if (typeof window === "undefined") return false;
  try {
    const itemStr = localStorage.getItem("auth_token");
    if (!itemStr) return false;
    const item = JSON.parse(itemStr);
    return item.idaplikasi === SUPER_ADMIN_APP_ID;
  } catch {
    return false;
  }
}

export function getUserInfo() {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("auth_token");
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed || {};
  } catch {
    return {};
  }
}

export function isInternalAdmin() {
  const { nippos, idaplikasi } = getUserInfo() || {};
  return /^\d+$/.test(nippos) && String(nippos) === "1" && idaplikasi !== SUPER_ADMIN_APP_ID;
}