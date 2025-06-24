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

export async function fetchHakAkses({ idaplikasi = "" }) {
  let endpoint = "/getlisthakakses/all";
  let body = { idApp: idaplikasi };

  if (idaplikasi) {
    endpoint = "/getHakAksesByApp";
    body = { idApp: idaplikasi };
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Gagal fetch hak akses");
  }

  const json = await res.json();
  return json.data; // ✅ Ambil hanya bagian array-nya
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
  return json.data.map((item) => ({
    id: item.idhakakses?.toString(), // dibutuhkan agar bisa delete
    namaakses: item.namaakses ?? "-",
    status: item.status ?? "-",
  }));
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

// Ambil user akses berdasarkan ID
export const getHakAksesByID = async (id) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/hakAkses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal mengambil data aplikasi");
  const item = await res.json();

  return {
    id: item.id,
    namaakses: item.namaakses,
    status: item.status,
    idhakakses: item.idhakakses,
  };
};


// Update User Akses
export const updateHakAkses = async (id, data) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/hakAkses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      namaakses: data.namaakses,
      status: data.status,
    }),
  });

  if (!res.ok) throw new Error("Gagal mengupdate Hak Akses");
  return await res.json();
};


// Hapus aplikasi
export const deleteHakAkses = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/hakAkses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal menghapus Hak Akses");
  return true;
};
