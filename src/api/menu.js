import { getToken } from "./auth";

const token = getToken();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchJabatan() {
  const res = await fetch(`${BASE_URL}/getJabatan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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

// export async function fetchKantor() {
//     const token = getToken();
//   const res = await fetch(`${BASE_URL}/getKantor`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ nopend: "" }),
//   });

//   const result = await res.json();

//  const seen = new Set();
//   return result.data
//     .map((item) => ({
//       value: item.nopend,
//       label: `${item.nopend} - ${item.namaKantor}`,
//     }))
//     .filter((item) => {
//       if (seen.has(item.value)) return false;
//       seen.add(item.value);
//       return true;
//     });
// }

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

