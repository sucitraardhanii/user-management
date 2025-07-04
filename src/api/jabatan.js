import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = getToken(); // dipanggil sekali saja saat file di-load
  if (!token) throw new Error("Token tidak tersedia");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getJabatan(codeJabatan) {
  const res = await fetch(`${API_URL}/getJabatan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ codeJabatan }),
  });
  return res.json();
}

export async function createJabatan(payload) {
  const res = await fetch(`${API_URL}/createJabatan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateJabatan(payload) {
  const res = await fetch(`${API_URL}/updateJabatan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Update error detail:", err);
    throw new Error("Gagal update jabatan");
  }

  return res.json();
}
