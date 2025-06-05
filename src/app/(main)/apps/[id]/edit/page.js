"use client"; // ini penting digunakan untuk App Route di Next.js

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TextInput, Button, Box, Title, Group, Select } from "@mantine/core";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";
// useParams : mengambil parameter URL (id) dari route dinamis
// useState : Hook React untuk membuat state lokal
// TextInput, Button : komponen dari Mantine
// Box, Title : komponen UI seperti <div> dan <h2> bawaan dari Mantine

export default function EditAppPage() {
  const { id } = useParams(); // ini untuk mengambil parameter id
  const router = useRouter();
  const appId = Number(id);

  const apps = useAppStore((state) => state.apps);
  const updateApp = useAppStore((state) => state.updateApp);
  const deleteApp = useAppStore((state) => state.deleteApp);

  const existingApp = apps.find((app) => app.id == appId);

  const [app, setApp] = useState(
    existingApp || {
      name: "",
      address: "",
      status: "",
    }
  ); // ini membuat data user sementara, bisa digantikan dengan API nantinya

  useEffect(() => {
    if (existingApp) setApp(existingApp);
  }, [existingApp]);

  const handleSubmit = (e) => {
    e.preventDefault(); // ini berfungsi untuk mencegah reload halaman
    updateApp(appId, app); // ini yg akan menyimpan perubahan
    router.push("/apps");
    // alert(`Data untuk user ID ${id} disimpan!`); // ini untuk menampilkan konfirmasi simulai
  }; // nanti ini bisa diganti dengan fetch() atau axios.put() untuk kirim ke API

  const handleDelete = () => {
    const confirmed = confirm(`Yakin ingin menghapus app #${id}?`);
    if (confirmed) {
      // nanti bisa diganti: await fetch ('/api/users/${id}', {method: 'DELETE'})
      deleteApp(appId);
      alert(`Aplikasi #${id} berhasil dihapus.`);
      router.push("/apps"); // kembali ke halaman daftar user
    }
  };

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
          onChange={(value) => setApp({ ...app, status:value })}
          data={[
            {value: 'Aktif', label: 'Aktif'},
            {value: 'Tidak Aktif', label:'Tidak Aktif'},
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
