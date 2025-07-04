import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";
const XKEYAPP = "MkYCK2kBErcUVDO0ygpt_w==";
const XKEYACCESS = "Cz5JcSefOw8Hl7X--3okow2pg3h75KZdvZ6REDjpfP4=";

function getHeaders() {
  const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function headersXKey() {
 const token = getToken();
  if (!token) throw new Error("Token tidak tersedia");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "x-key-app": XKEYAPP,
    "x-key-access": XKEYACCESS,
  };
}

function handleErrorResponse(res, result, defaultMsg) {
  if (res.status === 401) return { error: "invalid_token" };
  if (res.status === 400 && result?.message?.toLowerCase().includes("data tidak ditemukan")) {
    return { error: "not_found" };
  }
  if (!res.ok) return { error: "server_error", detail: result?.message || defaultMsg };
  return null;
}

export async function fetchUserByApp(idApp) {
  try {
    const res = await fetch(`${BASE_URL}/userAllByApp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ idApp, activeAccount: "all" }),
    });
    const data = await res.json();
    const error = handleErrorResponse(res, data, 'Gagal mengambil user by app');
    if (error) return error;
    return { data };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

export async function fetchUserByNippos(nippos) {
  try {
    const res = await fetch(`${BASE_URL}/getUser`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nippos }),
    });
    const result = await res.json();
    const error = handleErrorResponse(res, result, "Gagal ambil data user by nippos");
    if (error) return error;

    return {
      data: (result.data || []).map((user) => ({
        ...user,
        nippos: user.nippos,
        nama: user.nama,
        email: user.email,
        jabatan: user.jabatan,
        kantor: user.kantor,
        namaKantor: user.kantor,
        statusPegawai: user.status_pegawai === 4 ? "Non Organik" : "Organik",
        statusAkun: user.status_akun === 1 ? "Aktif" : "Non-Aktif",
      }))
    };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

export async function fetchUserByAppOrg(idApp, idExternal) {
  try {
    const res = await fetch(`${BASE_URL}/userAllByAppOrg`, {
      method: "POST",
      headers: headersXKey(),
      body: JSON.stringify({ idApp, idExternal: [idExternal] }),
    });
    const result = await res.json();
    const error = handleErrorResponse(res, result, "Gagal fetch user by organisasi");
    if (error) return error;
    return { data: result };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

export async function checkActiveUser(nippos) {
  try {
    const res = await fetch(`${BASE_URL}/activeUser`, {
      method: "POST",
      headers: headersXKey(),
      body: JSON.stringify({ nippos }),
    });
    const data = await res.json();
    return { data };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

export async function validateUser(nippos) {
  try {
    const res = await fetch(`${BASE_URL}/validasiUser`, {
      method: "POST",
      headers: headersXKey(),
      body: JSON.stringify({ nippos, statusakun: 1 }),
    });
    const data = await res.json();
    return { data };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

export async function selectAplikasi() {
  try {
    const token = getToken();
    if (!token) return { error: "invalid_token" };

    const res = await fetch(`${BASE_URL}/getaplikasi/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const error = handleErrorResponse(res, data, "Gagal fetch aplikasi");
    if (error) return error;

    return {
      data: data.map((item) => ({
        value: String(item.idaplikasi),
        label: item.nama,
      })),
    };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

// export async function fetchExternalOrg() {
//   const res = await fetch(`${BASE_URL}/getExternalOrgAll`, {
//     method: "POST",
//     headers: getHeaders(),
//     body: JSON.stringify({ statusActive: "all" }),
//   });

//   const result = await res.json();
//   return { data: result.data };
// }


export async function encryptId(id) {
  try {
    const res = await fetch(`${BASE_URL}/encId`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ data: id, key: ENCRYPT_KEY }),
    });
    const result = await res.json();
    const error = handleErrorResponse(res, result, "Gagal encrypt ID aplikasi");
    if (error) return error;
    return { data: result.data };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

export async function updateUser(payload) {
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    const error = handleErrorResponse(res, result, "Gagal update user");
    if (error) return error;
    return { data: result };
  } catch (err) {
    return { error: "network_error", detail: err.message };
  }
}

// DELETE USER
export async function deleteUser(nippos) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "DELETE",
    headers: getHeaders(),
    body: JSON.stringify({ nippos }),
  });
  return await res.json();
}

export async function fetchUser(nippos) {
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ nippos }),
  });

  return res.json();
}

export async function fetchJabatan() {
  const res = await fetch(`${BASE_URL}/getJabatan`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ codeJabatan: "" }),
  });

  const result = await res.json();

  // kalau API return { data: [...] }, kita ambil dari situ
  const data = Array.isArray(result)
    ? result
    : Array.isArray(result?.data)
    ? result.data
    : [];

  return data
    .filter((item) => item.status === 1)
    .map((item) => ({
      value: item.code_jabatan,
      label: `${item.code_jabatan} - ${item.namajabatan}`,
    }));
}

export async function fetchExternalOrg() {
  const res = await fetch(`${BASE_URL}/getExternalOrgAll`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ statusActive: "all" }),
  });

  const result = await res.json();
  return { data: result.data };
}