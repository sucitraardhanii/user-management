import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";

function getHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchAplikasi() {
  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers:getHeaders(),
  });

  if (!res.ok) throw new Error("Gagal ambil aplikasi");

  const apps = await res.json(); // langsung array
  return apps.map((item) => ({
    label: item.nama,
    value: item.idaplikasi.toString(),
  }));
}

export async function fetchHakAkses(encryptedId) {
  const res = await fetch(`${BASE_URL}/getHakAksesByApp`, {
    method: "POST",
    headers:getHeaders(),
    body: JSON.stringify({
      idApp: encryptedId,
    }),
  });

  if (!res.ok) throw new Error("Gagal ambil hak akses");

  const { data } = await res.json();

  return data.map((item) => ({
    label: item.namaakses,
    value: item.idhakakses.toString(),
  }));
}

export async function fetchMenu(payload) {
  const res = await fetch(`${BASE_URL}/getmenu`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Gagal ambil menu");

  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}


export async function encryptId(id) {
  const res = await fetch(`${BASE_URL}/encId`, {
    method: "POST",
    headers:getHeaders(),
    body: JSON.stringify({
      data: String(id),
      key: ENCRYPT_KEY,
    }),
  });

  if (!res.ok) throw new Error("Gagal encrypt ID aplikasi");

  const json = await res.json();
  return json.data;
}
