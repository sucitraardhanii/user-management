import { useState, useEffect } from 'react';
import { Modal, TextInput, Select, Button, Stack, Group,Autocomplete, Loader, } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from '@mantine/hooks';
import { fetchJabatan, searchKantor, fetchAllKantor } from "@/api/menu";
import { fetchExternalOrg } from '@/api/regisUserExtern';

export default function UserEditModal({ opened, onClose, userData, onSubmit }) {
const [jabatanOptions, setJabatanOptions] = useState([]);
const [kantorOptions, setKantorOptions] = useState([]);
const [allKantorCache, setAllKantorCache] = useState([]);
const [kantorInput, setKantorInput] = useState("");
const [externalOrgOptions, setExternalOrgOptions] = useState([]);
const [loading, setLoading] = useState(true);
const [loadingKantor, setLoadingKantor] = useState(false);
const [loadingJabatan, setLoadingJabatan] = useState(false);
const [debounced] = useDebouncedValue(kantorInput, 300);


  const form = useForm({
    initialValues: {
      nippos:"",
      nama: "",
      email: "",
      jabatan: "",
      kantor: "",
      status_akun: "",
      status_pegawai: "",
      codeJabatan:"",
    },
  });

useEffect(() => {
  const fetchInitialData = async () => {
    setLoadingJabatan(true);
    try {
      const jabatan = await fetchJabatan();
      const semuaKantor = await fetchAllKantor();
      const externalOrg = await fetchExternalOrg();

      // Tambahkan jabatan user ke option jika belum ada
      if (userData?.jabatan && !jabatan.some(j => j.value === userData.jabatan)) {
        jabatan.push({ label: userData.jabatan, value: userData.jabatan });
      }

      // Tambahkan kantor user ke option jika belum ada
      if (userData?.kantor && !semuaKantor.some(k => k.value === userData.kantor)) {
        semuaKantor.push({ label: userData.kantor, value: userData.kantor });
      }

      setJabatanOptions(jabatan);
      setAllKantorCache(semuaKantor);
      setExternalOrgOptions(externalOrg);
    } catch (err) {
      console.error("Gagal ambil jabatan/kantor:", err);
    } finally {
      setLoadingJabatan(false);
    }
  };

  if (opened) {
    fetchInitialData();
  }
}, [opened, userData]);


useEffect(() => {
  const doSearch = async () => {
    if (!debounced) return;

    if (/^\d+$/.test(debounced)) {
      setLoadingKantor(true);
      try {
        const result = await searchKantor(debounced);
        setKantorOptions(uniqueByValue(result));
      } catch (err) {
        console.error("Gagal search kantor:", err);
      } finally {
        setLoadingKantor(false);
      }
    } else {
      const filtered = allKantorCache.filter((item) =>
        item.label.toLowerCase().includes(debounced.toLowerCase())
      );
      setKantorOptions(uniqueByValue(filtered));
    }
  };

  doSearch();
}, [debounced]);

const uniqueByValue = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
};

  // Injeksi ulang data ketika userData berubah
  useEffect(() => {
    if (userData && jabatanOptions.length > 0) {
    const jabatanCode = jabatanOptions.find(j => j.label === userData.jabatan)?.value || "";
    
    if (userData) {
      form.setValues({
        nippos: userData.nippos||"",
        nama: userData.nama || "",
        email: userData.email || "",
        jabatan: jabatanCode,
        kantor: userData.kantor || "",
        status_akun: userData.status_akun === 1 ? "Aktif" : "Non-Aktif",
        status_pegawai: userData.status_pegawai === 4 ? "Non Organik" : "Organik",
      });
    }}
  }, [userData, jabatanOptions]);

  const handleSubmit = (values) => {
  const payload = {
    nippos: values.nippos, // dari field nippos (disabled input)
    email: values.email,
    nama: values.nama,
    codeJabatan: values.jabatan, 
    kantor: values.kantor,       // ini harus value, bukan label
    statuspegawai: values.status_pegawai === "Non Organik" ? 4 : 2,
    statusakun: values.status_akun === "Aktif" ? 1 : 0,
    id_external_org: userData?.id_external_org || "", // bisa hidden field
    password: values.password || "", // atau kosong jika backend allow
  };

  onSubmit(payload);
};

  return (
    <Modal opened={opened} onClose={onClose} title="Edit User" size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Nippos" {...form.getInputProps("nippos")} disabled />
          <TextInput label="Nama" {...form.getInputProps("nama")} />
          <TextInput label="Email" {...form.getInputProps("email")} />
          <Select
            label="Pilih Jabatan"
            data={jabatanOptions}
            placeholder={loadingJabatan ? "Memuat..." : "Pilih Jabatan"}
            {...form.getInputProps("jabatan")}
            searchable
            clearable
            disabled={loadingJabatan}
          />

          <Autocomplete
            label="Pilih Kantor"
            placeholder="Ketik NOPEND atau Nama Kantor"
            data={kantorOptions.map((opt) => opt.label)} // hanya label
            value={
              kantorOptions.find((opt) => opt.value === form.values.kantor)?.label || ""
            }
            onChange={(val) => {
              setKantorInput(val);
              const selected = kantorOptions.find((opt) => opt.label === val);
              form.setFieldValue("kantor", selected?.value || "");
            }}
            rightSection={loadingKantor ? <Loader size="xs" /> : null}
            clearable
            disabled={loadingKantor}
          />


          <Select
            label="Status Akun"
            data={["Aktif", "Non-Aktif"]}
            {...form.getInputProps("status_akun")}
          />
          <Select
            label="Status Pegawai"
            data={["Organik", "Non Organik"]}
            {...form.getInputProps("status_pegawai")}
          />
        </Stack>
        <Select
              label="Organisasi Eksternal"
              placeholder="Pilih organisasi"
              data={externalOrgOptions}
              key={form.key('externalOrg')}
              {...form.getInputProps('externalOrg')}
              clearable
              searchable
              disabled={loading}
              required
            />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Batal</Button>
          <Button type="submit">Simpan</Button>
        </Group>
      </form>
    </Modal>
  );
}
