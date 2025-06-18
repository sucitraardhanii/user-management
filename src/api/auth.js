// src/lib/auth.js
import { showNotification, updateNotification } from "@mantine/notifications";

export const login = async ({ nippos, password, idaplikasi }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const appId = process.env.NEXT_PUBLIC_APP_ID;
  //export const login = async ({ nippos, password }) => {
 // export const login = async ({}) => {
  // const nippos = process.env.NEXT_PUBLIC_NIPPOS;
  // const password = process.env.NEXT_PUBLIC_PASSWORD;

  const res = await fetch(`${apiUrl}/authMob`, {
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
  saveToken(data.token, idaplikasi);

  const contentType = res.headers.get("content-type");
  //if (!res.ok) throw new Error(`HTTP ${res.status}`);
  showNotification({
          title: "Berhasil Login",
          message: "Selamat Datang",
          color: "green",
        });
  

  if (!contentType?.includes("application/json")) {
    const html = await res.text();
    console.error("Response bukan JSON:", html);
    throw new Error("Server mengirim data bukan JSON");
  }
  

  if (!data.token) throw new Error("Token tidak ditemukan");
  
  showNotification({
          title: "Gagal Login",
          message: "Silahkan Login Ulang",
          color: "green",
        });
  return data.token;
};


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

export function saveToken(token, idaplikasi) {
  const now = new Date();
  const expiry = now.getTime() + 60 * 60 * 10000; // 10 jam dari sekarang
  const item = {
    token,
    idaplikasi,
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


export function removeToken() {
  localStorage.removeItem("auth_token");
}

export const logout = () => {
  removeToken();
};

function decodeJwt(token) {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// Ambil token dari localStorage
const token = localStorage.getItem("auth_token");

if (token) {
  const decoded = decodeJwt(token);
  const idAplikasi = decoded["x-app"]; // 👈 ini biasanya idApp-nya
  console.log("ID Aplikasi:", idAplikasi);
}
