// api/fitur.js
import { getToken } from "./auth";

const token = getToken();
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};


// GET semua aplikasi
export async function fetchAplikasi() {
  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers,
  });

  if (!res.ok) throw new Error("Gagal ambil aplikasi");

  const apps = await res.json(); // langsung array
  return apps.map((item) => ({
    label: item.nama,
    value: item.idaplikasi.toString(),
  }));
}

// ENKRIP ID APLIKASI
export async function encryptId(id) {
  const res = await fetch(`${BASE_URL}/encId`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: id, // langsung string ID
      key: ENCRYPT_KEY,
    }),
  });

  if (!res.ok) throw new Error("Gagal encrypt ID aplikasi");

  const result = await res.json();
  return result.data;
}

// GET hak akses berdasarkan aplikasi terenkripsi
export async function fetchHakAkses(encryptedId) {
  const res = await fetch(`${BASE_URL}/getHakAksesByApp`, {
    method: "POST",
    headers,
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

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/userExt`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal membuat user");

  return res.json();
}

export async function validasiUser(data) {
  const res = await fetch(`${BASE_URL}/validasiUser`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal validasi User");

  return res.json();
}

export async function activeUser(data) {
  const res = await fetch(`${BASE_URL}/activeUser`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal Check User");

  return res.json();
}


export async function createUserAkses(data) {
  const res = await fetch(`${BASE_URL}/userAkses`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal membuat user akses");

  return res.json();
}

//Get All Organisasi
export async function fetchExternalOrg() {
  const res = await fetch(`${BASE_URL}/getExternalOrgAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ statusActive: "all" }),
  });

   const { data } = await res.json();
  return data.map((org) => ({
    label: org.nameOrganization,
    value: org.id_external_org,
  }));
}