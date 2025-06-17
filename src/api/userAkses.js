import { getToken } from "./auth";

const token = getToken();
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const PROD_URL = process.env.NEXT_PUBLIC_PROD_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};


// User Akses
export async function fetchUserAkses({ nippos = "", idaplikasi = "" }) {
  let endpoint = "/getUserAkses";
  let body = { nippos };

  if (nippos || idaplikasi) {
    endpoint = "/getUserAksesByApp";
    body = { nippos, idAplikasi: idaplikasi };
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Gagal fetch user akses");
  }

  const json = await res.json();
  return json.data; // ✅ Ambil hanya bagian array-nya
}



export async function fetchAplikasi() {
  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers,
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


export async function encryptId(data) {
  const res = await fetch(`${BASE_URL}/encId`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data, // pastikan dikirim sebagai integer
      key: ENCRYPT_KEY,
    }),
  });

  if (!res.ok) throw new Error("Gagal encrypt ID");

  const json = await res.json();
  return json.data; // contoh: "zWNxN3mYyLT6R7-A9BLe2A=="
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