"use client"; // ini penting digunakan untuk App Route di Next.js

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  TextInput,
  Button,
  Box,
  Title,
  Group,
  Text,
  Loader,
  Center,
  Select,
} from "@mantine/core";
import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  getAplikasiById,
  updateAplikasi,
  deleteAplikasi,
} from "@/api/aplikasi";
import { modals } from "@mantine/modals";
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
    if (!id) return;
    getAplikasiById(appId)
      .then(setApp)
      .catch((err) => console.error("Gagal ambil data:", err))
      .finally(() => setLoading(false));
  }, [appId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    showNotification({
      id: "update-aplikasi",
      title: "Menyimpan...",
      message: "Mohon tunggu, kami sedang menyimpan data",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });

    try {
      await updateAplikasi(appId, app);

      updateNotification({
        id: "update-aplikasi",
        title: "Berhasil",
        message: "Data Aplikasi Berhasil Diperbaharui",
        color: "teal",
        icon: <IconCheck size={18} />,
        autoClose: 3000,
      });

      router.push("/apps");
    } catch (err) {
      console.error("Gagal Update:", err);

      updateNotification({
        id: "update-aplikasi",
        title: "Gagal",
        message: "Data Aplikasi Gagal Diperbaharui",
        color: "red",
        icon: <IconX size={18} />,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = (id, name) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus",
      centered: true,
      size: "sm", // biar seperti notifikasi
      overlayProps: { blur: 2, opacity: 0.1 },
      children: (
        <Text size="sm">
          Yakin ingin menghapus <b>{name}</b>?
        </Text>
      ),
      labels: { confirm: "Hapus", cancel: "Batal" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        showNotification({
          id: "delete-aplikasi",
          title: "Menghapus...",
          message: `Sedang menghapus ${name}`,
          loading: true,
          autoClose: false,
          disallowClose: true,
        });

        try {
          await deleteAplikasi(id);

          updateNotification({
            id: "delete-aplikasi",
            title: "Berhasil",
            message: `${name} berhasil dihapus`,
            color: "teal",
            icon: <IconCheck size={18} />,
            autoClose: 3000,
          });

          router.push("/apps");
        } catch (err) {
          updateNotification({
            id: "delete-aplikasi",
            title: "Gagal",
            message: `Tidak dapat menghapus ${name}`,
            color: "red",
            icon: <IconX size={18} />,
            autoClose: 3000,
          });
        }
      },
    });
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
          data={["Aktif","Tidak Aktif"]}
          placeholder="Pilih Status"
          required
          mb="sm"
        />
        <Group mt="md">
          <Button type="submit" mt="md">
            Simpan Perubahan
          </Button>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDelete(appId, app.name)}
          >
            Hapus Aplikasi
          </Button>
        </Group>
      </form>
    </Box>
  );
}
