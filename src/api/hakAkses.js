import { getToken } from "./auth";

// Konstanta umum
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";

// Header helper dinamis
function getAuthHeaders() {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ========== FETCH SEMUA HAK AKSES ==========
export async function fetchHakAkses() {
  const res = await fetch(`${BASE_URL}/getlisthakakses/all`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Gagal fetch hak akses");

  const json = await res.json();
  if (!Array.isArray(json.data)) throw new Error("Format response tidak sesuai");

  return json.data.map((item, index) => ({
    id: index + 1,
    namaAkses: item.namaAkses,
    namaAplikasi: item.namaAplikasi,
    statusAktif: item.statusAktif,
  }));
}

// ========== FETCH SEMUA APLIKASI ==========
export async function fetchAplikasi() {
  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Gagal ambil aplikasi");

  const apps = await res.json();
  return apps.map((item) => ({
    label: item.nama,
    value: item.idaplikasi.toString(),
  }));
}

// ========== ENKRIPSI ID APLIKASI ==========
export async function encryptId(id) {
  const res = await fetch(`${BASE_URL}/encId`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: id,
      key: ENCRYPT_KEY,
    }),
  });

  if (!res.ok) throw new Error("Gagal encrypt ID aplikasi");

  const json = await res.json();
  return json.data;
}

// ========== GET HAK AKSES BERDASARKAN APP ==========
export async function getListHakAksesByApp(encryptedId) {
  const res = await fetch(`${BASE_URL}/getHakAksesByApp`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      idApp: encryptedId, // pastikan field-nya sesuai dengan backend
    }),
  });

  if (!res.ok) throw new Error("Gagal ambil hak akses berdasarkan aplikasi");

  const json = await res.json();
  return json.data;
}

// ========== CREATE ==========
export async function createHakAkses(data) {
  const res = await fetch(`${BASE_URL}/addhakakses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal membuat hak akses");

  return await res.json();
}

// ========== DELETE ==========
export async function deleteHakAkses(id) {
  const res = await fetch(`${BASE_URL}/deletehakaksesaplikasi/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Gagal menghapus hak akses");

  return await res.json();
}
