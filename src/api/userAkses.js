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

  const res = await fetch(`${BASE_URL}/userAkses`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ "id": (id) }),
  });

  if (!res.ok) throw new Error("Gagal hapus aplikasi");
  return res.json();
};

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

export async function createUserAkses(payload) {
  const res = await fetch(`${BASE_URL}/userAkses`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    const error = new Error(result.message || 'Gagal');
    error.response = { data: result };
    throw error;
  }

  return result;
}


export async function fetchAllUserNippos() {
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ nippos: '' }),
  });

  const result = await res.json();

  const arr = Array.isArray(result.data) ? result.data : [result.data];

  return arr.map((item) => ({
    value: item.nippos,
    label: `${item.nippos} - ${item.nama}`,
  }));
}


export async function searchUserNippos(query) {
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ nippos: query }),
  });

  const result = await res.json();

  if (!result?.data) return [];

  const arr = Array.isArray(result.data) ? result.data : [result.data];

  return arr.map((item) => ({
    value: item.nippos,
    label: `${item.nippos} - ${item.nama}`,
  }));
}

