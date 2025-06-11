"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Group,
  Select,
  Loader,
  Center,
} from "@mantine/core";
import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { getAplikasiById, updateAplikasi, deleteAplikasi } from "@/api/aplikasi";
// useParams : mengambil parameter URL (id) dari route dinamis
// useState : Hook React untuk membuat state lokal
// TextInput, Button : komponen dari Mantine
// Box, Title : komponen UI seperti <div> dan <h2> bawaan dari Mantine

export default function EditAplikasiPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({ nama: "", alamat: "", status: "" });
  const [loading, setLoading] = useState(true);

  const [app, setApp] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAplikasiById(id);
        console.log("data api", data); // debug

        if (data) {
          setForm({
            nama: data.nama ?? "",
            alamat: data.alamat ?? "",
            status: data.status?.toString() ?? "",
          });
          setReady(true); // ✅ hanya tampil setelah data masuk
        }
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    showNotification({
      id:"update-aplikasi",
      title: "Menyimpan...",
      message: "Mohon tunggu, kami sedang menyimpan data",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });

    try {
      await updateAplikasi(id, form);
      showNotification({
        title: "Berhasil",
        message: "Aplikasi berhasil diperbarui",
        color: "teal",
        icon: <IconCheck size={18} />,
        autoClose: 3000,
      });

      router.push("/apps");
    } catch (err) {
      console.error("Update gagal:", err);
      showNotification({
        title: "Gagal",
        message: "Gagal update aplikasi",
        color: "red",
        icon: <IconX size={18} />,
        autoClose: 3000,
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
    <Box>
      <Title order={2} mb="md">
        Edit Aplikasi
      </Title>
      <Breadcrumb />
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Alamat"
          value={form.alamat}
          onChange={(e) => setForm({ ...form, alamat: e.target.value })}
          required
          mb="sm"
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(val) => setForm({ ...form, status: val })}
          data={[
            { value: "1", label: "Aktif" },
            { value: "0", label: "Tidak Aktif" },
          ]}
          placeholder="Pilih status"
          required
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
