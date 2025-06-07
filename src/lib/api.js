import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fungsi ambil semua aplikasi
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

  // Mapping struktur data agar cocok dengan tampilan frontend
  return data.map((item) => ({
    id: item.idaplikasi,
    name: item.nama,
    address: item.alamat,
    status: item.status,
  }));
};

// Fungsi hapus aplikasi
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
