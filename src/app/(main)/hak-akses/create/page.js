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
import { fetchAplikasi, encryptId } from "@/api/registrasiUser";
import { fetchJabatan } from "@/api/menu";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { createHakAkses } from "@/api/hakAkses";

export default function AddHakAkses() {
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [kategoriInput, setKategoriInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      idaplikasi: "",
      namaakses: "",
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [jabatan, idaplikasi] = await Promise.all([
          fetchJabatan(),
          fetchAplikasi(),
        ]);

        // Format ulang data untuk dropdown
        const jabatanFormatted = jabatan.map((item) => ({
          value: item.value?.toString() ?? item.id?.toString(),
          label: item.label ?? item.nama ?? "Tanpa Nama",
        }));

        const aplikasiFormatted = idaplikasi.map((item) => ({
          value: item.value?.toString() ?? item.id?.toString(),
          label: item.label ?? item.nama ?? "Tanpa Nama",
        }));

        setJabatanOptions(jabatanFormatted);
        setAplikasiOptions(aplikasiFormatted);
      } catch (err) {
        console.error("Gagal ambil data awal:", err);
        showNotification({
          title: "Error",
          message: "Gagal memuat data dropdown",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createHakAkses(form.values);

      showNotification({
        title: "Berhasil",
        message: "Hak akses berhasil ditambahkan",
        color: "teal",
      });

      router.push("/hak-akses"); // ✅ redirect ke halaman hak akses
    } catch (err) {
      console.error("Gagal simpan:", err);
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
            placeholder={loading ? "Loading..." : "Pilih Aplikasi"}
            data={aplikasiOptions}
            {...form.getInputProps("idaplikasi")}
            searchable
            clearable
            disabled={loading}
            required
            mt="md"
          />

          <Autocomplete
            label="Pilih Kategori Jabatan"
            placeholder="Ketik atau pilih kategori"
            data={jabatanOptions.map((opt) => opt.label)}
            value={kategoriInput}
            onChange={(val) => {
              setKategoriInput(val);
              const selected = jabatanOptions.find((opt) => opt.label === val);
              form.setFieldValue("namaakses", selected?.value || "");
            }}
            rightSection={loadingKategori ? <Loader size="xs" /> : null}
            clearable
            disabled={loading}
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
