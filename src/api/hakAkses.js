import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

// Tambah aplikasi
export const createHakAkses = async (data) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/addaplikasi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama: data.name,
      alamat: data.address,
    }),
  });

  if (!res.ok) throw new Error("Gagal menambahkan aplikasi");
  return await res.json();
};

export const deleteHakAkses = async (idaplikasi) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/deletaplikasi`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ idaplikasi: String(idaplikasi) }),
  });

  if (!res.ok) throw new Error("Gagal hapus user akses");
  return res.json();
};

// api/hakAkses.js
export async function getHakAksesByApp(idApp) {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getHakAksesByApp`, {
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getlisthakakses/eKMPDrN2zHPAs_-Bh53Y_w%3D%3D`, {
    headers: {
       Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
