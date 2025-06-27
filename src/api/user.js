import { getToken } from "./auth";

const token = getToken();
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENCRYPT_KEY = "$RAI^bYJey2jhDzv+V9FcsUnV";
const XKEYAPP = "MkYCK2kBErcUVDO0ygpt_w==";
const XKEYACCESS = "Cz5JcSefOw8Hl7X--3okow2pg3h75KZdvZ6REDjpfP4=";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
  "x-key-app": XKEYAPP,
  "x-key-access":XKEYACCESS
};

//get user external sesuai login
export async function fetchUserByApp(idApp) {
  const res = await fetch(`${BASE_URL}/userAllByApp`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ idApp:idApp, activeAccount:"all" })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Gagal mengambil user by app');
  return data;
}

export async function fetchUserByNippos(nippos) {
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ nippos }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal ambil data user by nippos");

  return (result.data || []).map((user) => ({
    ...user,
    // mapping ulang biar cocok dengan struktur tabel & modal
    nippos: user.nippos,
    nama: user.nama,
    email: user.email,
    jabatan: user.jabatan,
    kantor: user.kantor,
    namaKantor: user.kantor,
    statusPegawai: user.status_pegawai === 4 ? "Non Organik" : "Organik",
    statusAkun: user.status_akun === 1 ? "Aktif" : "Non-Aktif",
  }));
}

export async function fetchUserByAppOrg(idApp, idExternal) {
  const res = await fetch(`${BASE_URL}/userAllByAppOrg`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      idApp,
      idExternal:[idExternal], // <- array of 1
    }),
  });

  const result = await res.json();

  // ✅ Tangani respon 400 = data tidak ditemukan, tetap kembalikan array kosong
  if (res.status === 400 && result.message?.toLowerCase().includes("data tidak ditemukan")) {
    return { data: [] }; // ⬅️ agar tetap bisa .data tanpa error
  }

  if (!res.ok) {
    throw new Error(result.message || "Gagal fetch user by organisasi");
  }

  return result;
}



//Update Data USer
export async function updateUser(payload) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Gagal update user");
  }

  return result;
}


export async function checkActiveUser(nippos) {
  const res = await fetch(`${BASE_URL}/activeUser`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nippos }),
  });
  return res.json();
}

export async function validateUser(nippos) {
  const res = await fetch(`${BASE_URL}/validasiUser`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nippos, statusakun: 1 }),
  });
  return res.json();
}
