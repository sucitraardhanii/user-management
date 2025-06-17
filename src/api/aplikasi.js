import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";

const token = getToken();

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

// Ambil semua aplikasi
export const fetchAplikasi = async () => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers,
  });

  if (!res.ok) throw new Error("Gagal fetch aplikasi");
  const data = await res.json();

  return data.map((item) => ({
    id: item.idaplikasi,
    name: item.nama,
    address: item.alamat,
    status: item.status,
    created_at: item.creatde_at,
    idaplikasi: item.idaplikasi,
  }));
};

// Hapus aplikasi
export const deleteAplikasi = async (idaplikasi) => {
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

  if (!res.ok) throw new Error("Gagal hapus aplikasi");
  return res.json();
};


// Tambah aplikasi
export const createAplikasi = async (data) => {
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

// Ambil aplikasi berdasarkan ID
export const getAplikasiById = async (id) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/getaplikasi/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mengambil data aplikasi: ${res.status} - ${errorText}`);
  }

  const json = await res.json();
  return json?.[0] ?? null; // karena response langsung array
};

// Update aplikasi
export const updateAplikasi = async ({ idaplikasi, nama, alamat, status }) => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}/updateaplikasi`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      idaplikasi, // string atau number, sesuai backend
      nama,
      alamat,
      status,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal update aplikasi: ${res.status} - ${errorText}`);
  }

  return res.json();
};

export async function encryptId(id) {
  const res = await fetch(`${BASE_URL}/encId`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: String(id),
      key: ENCRYPT_KEY,
    }),
  });

  if (!res.ok) throw new Error("Gagal encrypt ID aplikasi");

  const json = await res.json();
  return json.data;
}