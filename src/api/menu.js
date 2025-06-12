import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchJabatan() {
    const token = getToken();
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

