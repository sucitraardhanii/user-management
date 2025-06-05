// lib/api.js
import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAplikasi = async () => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal fetch aplikasi");
  return res.json();

}


export async function fetchHakAkses() {
  const token = getToken();
 const res = await fetch(`${BASE_URL}/getlisthakakses/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok || result.statusCode !== 200) {
    throw new Error(result.message || "Gagal mengambil data hak akses");
  }

  return result.data;
}
