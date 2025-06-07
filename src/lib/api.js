import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Ambil semua aplikasi
export const fetchAplikasi = async () => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal fetch aplikasi");
  const data = await res.json();

  return data.map((item) => ({
    id: item.idaplikasi,
    name: item.nama,
    address: item.alamat,
    status: item.status,
  }));
};

// Hapus aplikasi
export const deleteAplikasi = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/aplikasi/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal menghapus aplikasi");
  return true;
};

// Tambah aplikasi
export const createAplikasi = async (data) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/aplikasi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama: data.name,
      alamat: data.address,
      status: data.status,
    }),
  });

  if (!res.ok) throw new Error("Gagal menambahkan aplikasi");
  return await res.json();
};

// Ambil aplikasi berdasarkan ID
export const getAplikasiById = async (id) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/aplikasi/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal mengambil data aplikasi");
  const item = await res.json();

  return {
    id: item.idaplikasi,
    name: item.nama,
    address: item.alamat,
    status: item.status,
  };
};

// Update aplikasi
export const updateAplikasi = async (id, data) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/aplikasi/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama: data.name,
      alamat: data.address,
      status: data.status,
    }),
  });

  if (!res.ok) throw new Error("Gagal mengupdate aplikasi");
  return await res.json();
};
