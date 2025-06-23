"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Select,
  TextInput,
  Button,
  Group,
  Container,
  Loader,
} from "@mantine/core";
import { fetchAplikasi, encryptId, createHakAkses } from "@/api/hakAkses";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";

export default function AddHakAkses() {
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [loadingAplikasi, setLoadingAplikasi] = useState(true);
  const [encrypting, setEncrypting] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      idaplikasi: "",
      encryptIdAplikasi: "",
      namaakses: "",
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const apps = await fetchAplikasi();
        setAplikasiOptions(apps);
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

  const handleChangeAplikasi = async (idaplikasi) => {
    form.setFieldValue("idaplikasi", idaplikasi);
    form.setFieldValue("encryptIdAplikasi", "");

    if (!idaplikasi) return;

    try {
      setEncrypting(true);
      const encrypted = await encryptId(idaplikasi);
      form.setFieldValue("encryptIdAplikasi", encrypted);
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Gagal",
        message: "Gagal mengenkripsi ID aplikasi",
        color: "red",
      });
    } finally {
      setEncrypting(false);
    }
  };

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

          <TextInput
            label="Nama Akses"
            placeholder="Masukkan nama akses"
            {...form.getInputProps("namaakses")}
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
