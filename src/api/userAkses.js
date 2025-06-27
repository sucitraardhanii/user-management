import { getToken } from "./auth";
// mengambil token otentikasi dari modul auth

// Konstanta umum
const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // URL dasar API, diambil dari .env
const PROD_URL = process.env.NEXT_PUBLIC_PROD_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV"; // Kunci untuk enkripsi ID aplikasi

// Header helper dinamis
function getAuthHeaders() {
  const token = getToken(); // dipanggil sekali saja saat file di-load
  if (!token) throw new Error("Token tidak tersedia");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
// header untuk semua fetch request, kecuali delete yang didefinisika ulang
// setaip request akan mengirimkan token otentikasi dalam header Authorization

// == USER AKSES API FUNCTIONS ==
export async function fetchUserAkses({ nippos = "", idaplikasi = "" }) {
  const token = getToken();
  let endpoint = "/getUserAkses";
  let body = { nippos };

  if (idaplikasi) {
    endpoint = "/getUserAksesByApp";
    body = { nippos, idAplikasi: idaplikasi };
  }
  
  if (nippos && idaplikasi) {
    endpoint = "/getUserAksesByApp";
    body = { nippos, idAplikasi: idaplikasi };
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Gagal fetch user akses");
  }

  const json = await res.json();
  return json.data;
}
// Fungsi untuk mengambil data user akses berdasarkan nippos dan idaplikasi
// Jika hanya nippos yang diberikan, akan mengambil semua user akses berdasarkan nippos.
// Jika idaplikasi juga diberikan, akan mengambil user akses berdasarkan nippos dan idaplikasi.
// mengembalikan hanya json.data yang berisi array user akses.

// == APLIKASI API FUNCTIONS ==
export async function fetchAplikasi() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Gagal ambil aplikasi");

  const apps = await res.json();

  const encryptedApps = await Promise.all(
    apps.map(async (item) => ({
      label: item.nama,
      //value: await encryptId(item.idaplikasi), // kirim string, akan dikonversi ke integer
      value: item.idaplikasi.toString(),
    }))
  );
  return encryptedApps;
}
// Fungsi untuk mengambil daftar aplikasi dari API
// Menggunakan fetch untuk mendapatkan data dari endpoint /getaplikasi/all
// Mengambil semua aplikasi tanpa pagination
// Data diformat jadi array objek {label, value} untuk dipakai di dropdown

// == ENCRYPTION FUNCTION ==
export async function encryptId(data) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/encId`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data, // pastikan dikirim sebagai integer
      key: ENCRYPT_KEY,
    }),
  });

  if (!res.ok) throw new Error("Gagal encrypt ID");

  const json = await res.json();
  return json.data; // contoh: "zWNxN3mYyLT6R7-A9BLe2A=="
}
// Fungsi untuk mengenkripsi ID aplikasi
// Menggunakan endpoint /encId untuk mengenkripsi ID dengan kunci ENCRYPT_KEY
// Mengembalikan ID terenkripsi sebagai string

// == GET USER AKSES BY Nippos ==
export const getUserAksesByNippos = async (nippos) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/getUserAkses/${nippos}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ nippos }),
  });

  if (!res.ok) throw new Error("Gagal mengambil data aplikasi");
  const result = await res.json();
  return result.data;
};
// Fungsi untuk mengambil data user akses berdasarkan ID
// Memanggil data user akses tertentu berdasarkan idAkses
// Menggunakan POST, meskipun biasanya GET lebih lazim - disesuaikan dengan backend

// == UPDATE USER AKSES FUNCTIONS ==
export async function updateUserAkses(payload) {
  const token = getToken();
  try {
    const res = await fetch(`${BASE_URL}/userAkses`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        id: payload.id,
        nippos: payload.nippos,
        idHakAkses: payload.idHakAkses,
        statusUserAkses: payload.statusUserAkses,
      }),
    });

    if (!res.ok) throw new Error("Gagal update user akses");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updateUserAkses:", error);
    throw error;
  }
}
// Fungsi untuk memperbarui data user akses
// Memperbaharui nippos dan statusUserAkses untuk user akses tertentu
// Menggunakan endpoint /userAkses/{id} dengan metode PUT

// == DELETE USER AKSES FUNCTION ==
export const deleteUserAkses = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/userAkses`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ id: id }),
  });

  if (!res.ok) throw new Error("Gagal hapus aplikasi");
  return res.json();
};
// Fungsi untuk menghapus user akses berdasarkan ID
// Menghapus data user akses berdasarkan ID yang diberikan
// Mengirim ID di body karena backend tidak pakai path param untuk DELETE

export async function fetchHakAkses() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getHakAksesByApp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
    body: JSON.stringify({ idApp: process.env.NEXT_PUBLIC_APP_ID }),
  });

  const data = await res.json();
  return data.map((item) => ({ value: item.idHakAkses.toString(), label: item.namaAkses }));
}
// Fungsi untuk mengambil hak akses berdasarkan ID aplikasi
// Mengambil daftar hak akses berdasarkan ID aplikasi yang telah dienkripsi
// Data diubah ke format dropdown {label, value} untuk digunakan di form

// == CREATE USER AKSES FUNCTION ==
export async function createUserAkses(payload) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userAkses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menambahkan akses');
  }

  return await res.json();
}
// Fungsi untuk membuat user akses baru
// Mengirimkan payload berisi nippos, idAplikasi, dan hak akses
// Jika gagal, akan melempar error dengan pesan dari response

export async function fetchAllUserNippos() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ nippos: "" }),
  });

  const result = await res.json();

  if (!result?.data) return [];

  const arr = Array.isArray(result.data) ? result.data : [result.data];

  return arr.slice(0, 10).map((item) => ({
    value: item.nippos,
    label: `${item.nippos}`,
  }));
}
// Fungsi untuk mengambil semua nippos pengguna
// Mengambil semua user berdasarkan nippos kosong = berarti ambil semua
// untuk dropdown pencarian user

export async function searchUserNippos(query) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ nippos: query }),
  });

  const result = await res.json();

  if (!result?.data) return [];

  const arr = Array.isArray(result.data) ? result.data : [result.data];

  return arr.map((item) => ({
    value: item.nippos,
    label: `${item.nippos}`,
  }));
}
// Fungsi untuk mencari nippos pengguna berdasarkan query
// Mencari user berdasarkan nippos yang diberikan
// Hasil diformat jadi array dropdown
