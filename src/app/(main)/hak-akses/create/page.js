"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Select,
  Autocomplete,
  Button,
  Group,
  Container,
  Loader,
} from "@mantine/core";
import { fetchAplikasi, encryptId } from "@/api/hakAkses";
import { fetchJabatan } from "@/api/menu";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { createHakAkses } from "@/api/hakAkses";

export default function AddHakAkses() {
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [jabatanInput, setJabatanInput] = useState("");
  const [loadingAplikasi, setLoadingAplikasi] = useState(true);
  const [loadingJabatan, setLoadingJabatan] = useState(false);
  const [encrypting, setEncrypting] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      idaplikasi: "",
      encryptIdAplikasi: "",
      namaakses: "",
    },
  });

  // Fetch data aplikasi saat pertama
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [idaplikasi, jabatan] = await Promise.all([
          fetchAplikasi(),
          fetchJabatan(),
        ]);
        const aplikasiFormatted = idaplikasi.map((item) => ({
          value: item.value?.toString() ?? item.id?.toString(),
          label: item.label ?? item.nama ?? "Tanpa Nama",
        }));

        const jabatanFormatted = jabatan.map((item) => ({
          value: item.value?.toString() ?? item.id?.toString(),
          label: item.label ?? item.nama ?? "Tanpa Nama",
        }));

        setAplikasiOptions(aplikasiFormatted);
        setJabatanOptions(jabatanFormatted);
      } catch (err) {
        console.error("Error fetching applications:", err);
        showNotification({
          title: "Error",
          message: "Gagal memuat data aplikasi",
          color: "red",
        });
      } finally {
        setLoadingAplikasi(false);
      }
    };

    fetchInitialData();
  }, []);

  // Saat aplikasi dipilih: enkripsi ID & ambil jabatan
  const handleChangeAplikasi = async (idaplikasi) => {
    form.setFieldValue("idaplikasi", idaplikasi);
    form.setFieldValue("encryptIdAplikasi", "");
    form.setFieldValue("namaakses", "");
    setJabatanInput("");
    setJabatanOptions([]);

    if (!idaplikasi) return;

    try {
      setEncrypting(true);
      const encrypted = await encryptId(idaplikasi);
      form.setFieldValue("encryptIdAplikasi", encrypted);

      setLoadingJabatan(true);
      const jabatan = await fetchJabatan(idaplikasi);
      const jabatanFormatted = jabatan.map((item) => ({
          value: item.value?.toString() ?? item.id?.toString(),
          label: item.label ?? item.nama ?? "Tanpa Nama",
        }));

      setJabatanOptions(jabatanFormatted);
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Gagal",
        message: "Gagal mengenkripsi ID atau mengambil jabatan",
        color: "red",
      });
    } finally {
      setEncrypting(false);
      setLoadingJabatan(false);
    }
  };

  // Submit data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        idaplikasi: form.values.encryptIdAplikasi,
        namaakses: form.values.namaakses,
      };

      await createHakAkses(payload);

      showNotification({
        title: "Berhasil",
        message: "Hak akses berhasil ditambahkan",
        color: "teal",
      });

      router.push("/hak-akses");
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan data",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm">
      <Box my="xl">
        <Title order={2} mb="md">
          Tambah Hak Akses
        </Title>
        <form onSubmit={handleSubmit}>
          <Select
            label="Pilih Aplikasi"
            placeholder={loadingAplikasi ? "Loading..." : "Pilih Aplikasi"}
            data={aplikasiOptions}
            value={form.values.idaplikasi}
            onChange={handleChangeAplikasi}
            searchable
            clearable
            disabled={loadingAplikasi}
            required
            mt="md"
            rightSection={encrypting ? <Loader size="xs" /> : null}
          />

          <Autocomplete
            label="Pilih Kategori Jabatan"
            placeholder={
              loadingJabatan
                ? "Memuat jabatan..."
                : jabatanOptions.length === 0
                ? "Pilih aplikasi terlebih dahulu"
                : "Ketik atau pilih jabatan"
            }
            data={jabatanOptions}
            value={
              jabatanOptions.find((opt) => opt.value === form.values.namaakses)
                ?.label ?? jabatanInput
            }
            onChange={(val) => {
              setJabatanInput(val);
              const selected = jabatanOptions.find((opt) => opt.label === val);
              form.setFieldValue("namaakses", selected?.value || "");
            }}
            rightSection={loadingJabatan ? <Loader size="xs" /> : null}
            clearable
            disabled={loadingJabatan || jabatanOptions.length === 0}
            required
            mt="md"
          />

          <Group mt="md">
            <Button type="submit">Simpan</Button>
          </Group>
        </form>
      </Box>
    </Container>
  );
}
