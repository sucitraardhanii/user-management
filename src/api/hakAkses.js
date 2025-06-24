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

export async function fetchHakAkses({ idaplikasi } = {}) {
  let endpoint = "/getlisthakakses/all";
  let options = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  // Jika ada idaplikasi, gunakan POST dan endpoint yang berbeda
  if (idaplikasi) {
  console.log("📡 fetchHakAkses → by app:", idaplikasi);
    endpoint = "/getHakAksesByApp";
    options = {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ idApp: idaplikasi }),
    };
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) throw new Error("Gagal fetch hak akses");

  const json = await res.json();

  return json.data.map((item) => ({
    idhakakses: item.idhakakses?.toString(),
    namaakses: item.namaakses ?? "-",
    status: item.status ?? "-",
  }));
}

export async function updateHakAkses(id, data) {
  const res = await fetch(`${BASE_URL}/updatehakakses`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      idhakakses: id,
      ...data,
    }),
  });

  if (!res.ok) throw new Error("Gagal update hak akses");

  return await res.json();
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

  const json = await res.json();
  console.log("🔐 Encrypted ID:", json.data);
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

// Hapus aplikasi
export const deleteHakAkses = async (idhakakses) => {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${BASE_URL}/deletehakaksesaplikasi`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ "id": (idhakakses) }),
  });

  if (!res.ok) throw new Error("Gagal hapus aplikasi");
  return res.json();
};

