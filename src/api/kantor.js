import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchKantor(nopend = "") {
  const res = await fetch(`${BASE_URL}/getKantor`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ nopend }),
  });

  if (!res.ok) throw new Error("Failed to fetch kantor");

  const json = await res.json();
  // Tambahan fallback jika json.data tidak ada
  return {
    data: Array.isArray(json.data) ? json.data : [],
  };
}


export async function fetchAllKantor() {
  const res = await fetch(`${BASE_URL}/getKantor`, {
    method: "POST",
    headers: { 
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json" },
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
    headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
     },
    body: JSON.stringify({ codeKantor: query }),
  });

  const result = await res.json();

  return result.data?.map((item) => ({
    value: item.nopend,
    label: `${item.nopend} - ${item.namaKantor}`,
  })) || [];
}

