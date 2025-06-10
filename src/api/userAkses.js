import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// User Akses
export async function fetchUserAkses({ nippos, idAplikasi }) {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  try {
    const res = await fetch(`${BASE_URL}/getUserAksesByApp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${token}`},
      body: JSON.stringify({ nippos, idAplikasi }),
    });

    const json = await res.json();
    console.log("📦 Response API:", json);

    return json.data || []; // kembalikan array kosong jika tidak ada data
  } catch (error) {
    console.error("Gagal fetch User Akses:", error);
    return [];
  }
}

// Ambil user akses berdasarkan ID
export const getUserAksesByID = async (id) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/userAkses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal mengambil data aplikasi");
  const item = await res.json();

  return {
    id: item.id,
    nippos: item.nippos,
    statusUserAkses: item.status,
    idHakAkses: item.idHakAkses,
  };
};


// Update User Akses
export const updateUserAkses = async (id, data) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/userAkses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nippos: data.nippos,
      statusUserAkses: data.status,
    }),
  });

  if (!res.ok) throw new Error("Gagal mengupdate aplikasi");
  return await res.json();
};


// Hapus aplikasi
export const deleteUserAkses = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/userAkses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal menghapus aplikasi");
  return true;
};