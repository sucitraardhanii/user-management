"use client"; // ini penting digunakan untuk App Route di Next.js

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  TextInput,
  Button,
  Box,
  Title,
  Group,
  Select,
  Loader,
  Center,
} from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { getAplikasiById, updateAplikasi, deleteAplikasi } from "@/api/api";
// useParams : mengambil parameter URL (id) dari route dinamis
// useState : Hook React untuk membuat state lokal
// TextInput, Button : komponen dari Mantine
// Box, Title : komponen UI seperti <div> dan <h2> bawaan dari Mantine

export default function EditAppPage() {
  const { id } = useParams(); // ini untuk mengambil parameter id
  const router = useRouter();
  const appId = Number(id);
  const [loading, setLoading] = useState(true);

  const [app, setApp] = useState({
    name: "",
    address: "",
    status: "",
  });

  useEffect(() => {
    getAplikasiById(appId)
      .then(setApp)
      .catch((err) => console.error("Gagal ambil data:", err))
      .finally(() => setLoading(false));
  }, [appId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAplikasi(appId, app);
      showNotification({
        title: "Berhasil",
        message: "Data aplikasi berhasil diperbarui",
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      router.push("/apps");
    } catch (err) {
      console.error("Gagal update:", err);
      showNotification({
        title: "Gagal",
        message: "Tidak dapat menyimpan perubahan",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm(`Yakin ingin menghapus aplikasi #${appId}?`);
    if (!confirmed) return;

    try {
      await deleteAplikasi(appId);
      showNotification({
        title: "Dihapus",
        message: `Aplikasi #${appId} berhasil dihapus`,
        color: "red",
      });
      router.push("/apps");
    } catch (err) {
      console.error("Gagal hapus:", err);
      showNotification({
        title: "Gagal",
        message: "Tidak dapat menghapus aplikasi",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Box maw={500} mx="auto">
      <Title order={2} mb="lg" ta="center">
        Edit Aplikasi #{appId}
      </Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nama"
          value={app.name}
          onChange={(e) => setApp({ ...app, name: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Alamat"
          value={app.address}
          onChange={(e) => setApp({ ...app, address: e.target.value })}
          required
          mb="sm"
        />
        <Select
          label="Status"
          value={app.status}
          onChange={(value) => setApp({ ...app, status: value })}
          data={[
            { value: "Aktif", label: "Aktif" },
            { value: "Tidak Aktif", label: "Tidak Aktif" },
          ]}
          placeholder="Pilih Status"
          mb="sm"
        />
        <Group mt="md">
          <Button type="submit" mt="md">
            Simpan Perubahan
          </Button>
          <Button variant="outline" color="red" onClick={handleDelete}>
            Hapus Aplikasi
          </Button>
        </Group>
      </form>
    </Box>
  );
}
