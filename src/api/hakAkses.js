import { getToken } from "./auth";

const token = getToken();
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

// Hak Akses
export const fetchHakAkses = async () => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/getlisthakakses/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal fetch hak akses");
  const json = await res.json();

  // Pastikan kita akses data dari field "data"
  if (!Array.isArray(json.data)) {
    throw new Error("Format response tidak sesuai");
  }

  return json.data.map((item, index) => ({
    id: index + 1,
    namaAkses: item.namaAkses,
    namaAplikasi: item.namaAplikasi,
    statusAktif: item.statusAktif,
  }));
};

// GET semua aplikasi
export async function fetchAplikasi() {
  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers,
  });

  if (!res.ok) throw new Error("Gagal ambil aplikasi");

  const apps = await res.json(); // langsung array
  return apps.map((item) => ({
    label: item.nama,
    value: item.idaplikasi.toString(),
  }));
}

// ENKRIP ID APLIKASI
export async function encryptId(id) {
  const res = await fetch(`${BASE_URL}/encId`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: id, // langsung string ID
      key: ENCRYPT_KEY,
    }),
  });

  if (!res.ok) throw new Error("Gagal encrypt ID aplikasi");

  const result = await res.json();
  return result.data;
}

// api/hakAkses.js
export async function getHakAksesByApp(idApp) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/getHakAksesByApp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ idApp }),
  });
  return res.json();
}

export async function getHakAksesAll() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/getlisthakakses/all`, {
    headers: {
       Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
