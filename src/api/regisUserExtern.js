// api/fitur.js
import { getToken } from "./auth";

// const token = getToken();
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";

function getHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET semua aplikasi
export async function fetchAplikasi() {
  const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
    headers:getHeaders()
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
    headers: getHeaders(),
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
    headers: getHeaders(),
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
    headers:getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal membuat user");

  return res.json();
}

export async function validasiUser(data) {
  const res = await fetch(`${BASE_URL}/validasiUser`, {
    method: "POST",
    headers:getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal validasi User");

  return res.json();
}

export async function activeUser(data) {
  const res = await fetch(`${BASE_URL}/activeUser`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal Check User");

  return res.json();
}


export async function createUserAkses(data) {
  const res = await fetch(`${BASE_URL}/userAkses`, {
    method: "POST",
    headers:getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal membuat user akses");

  return res.json();
}

//Get All Organisasi
export async function fetchExternalOrg() {
  const res = await fetch(`${BASE_URL}/getExternalOrgAll`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ statusActive: "all" }),
  });

  const { data } = await res.json();
  return data.map((org) => ({
    label: org.nameOrganization,
    value: org.id_external_org,
  }));
}

export async function fetchJabatan() {
  const res = await fetch(`${BASE_URL}/getJabatan`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ codeJabatan: "" }),
  });

  const result = await res.json();

  return result
    .filter((item) => item.status === 1)
    .map((item) => ({
      value: item.code_jabatan,
      label: `${item.code_jabatan} - ${item.namajabatan}`,
    }));
}

export async function fetchAllKantor() {
  const res = await fetch(`${BASE_URL}/getKantor`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ codeKantor: "" }),
  });

  const result = await res.json();

  return result.data?.map((item) => ({
    value: item.nopend,
    label: `${item.nopend} - ${item.namaKantor}`,
  })) || [];
}

export async function searchKantor(query) {
  const res = await fetch(`${BASE_URL}/getKantor`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ codeKantor: query }),
  });

  const result = await res.json();

  return result.data?.map((item) => ({
    value: item.nopend,
    label: `${item.nopend} - ${item.namaKantor}`,
  })) || [];
}