import { getToken } from "./auth";
import { notifications } from "@mantine/notifications";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getMenu({ idAplikasi, idHakAkses }) {
  try {
    const payload = { idAplikasi, idHakAkses };
    console.log("Payload getMenu:", payload);

    const res = await fetch(`${BASE_URL}/getmenu`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error("Error response body:", errMsg);

      if (errMsg.includes("Data Tidak Ditemukan")) {
        throw new Error("Data Tidak Ditemukan");
      }

      throw new Error("Gagal fetch menu");
    }

    const result = await res.json();
    return result.data || result;
  } catch (err) {
    throw err;
  }
}

export async function fetchAplikasi() {
  try {
    const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Gagal ambil aplikasi");

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Gagal ambil aplikasi:", err);
    return [];
  }
}

export async function fetchHakAkses() {
  try {
    const res = await fetch(`${BASE_URL}/getlisthakakses/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Gagal ambil hak akses");

    const result = await res.json();

    return result.data
      .filter((item) => !isNaN(item.namaAkses) && item.namaAkses.trim() !== "")
      .map((item) => ({
        idhakakses: parseInt(item.namaAkses),
        namaAkses: item.namaAkses,
        namaAplikasi: item.namaAplikasi,
      }));
  } catch (err) {
    console.error("Gagal ambil hak akses:", err);
    return [];
  }
}
