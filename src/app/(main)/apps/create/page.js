"use client";

import { useState } from "react";
import { TextInput, Button, Box, Title, Select } from "@mantine/core";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { createAplikasi } from "@/lib/api"; // ⬅️ pakai dari lib/api.js

export default function CreateAppPage() {
  const router = useRouter();
  const [app, setApp] = useState({
    name: "",
    address: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAplikasi(app);

      showNotification({
        title: "Berhasil",
        message: "Data aplikasi berhasil ditambahkan",
        color: "teal",
        icon: <IconCheck size={18} />,
      });

      router.push("/apps");
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Gagal",
        message: "Gagal menambahkan aplikasi",
        color: "red",
      });
    }
  };

  return (
    <Box>
      <Title order={2} mb="md">
        Tambah Aplikasi Baru
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
            { value: "1", label: "Aktif" },
            { value: "0", label: "Tidak Aktif" },
          ]}
          placeholder="Pilih Status"
          required
          mb="sm"
        />
        <Button type="submit" mt="md">
          Simpan
        </Button>
      </form>
    </Box>
  );
}
