"use client";

import { useState } from "react";
import { TextInput, Button, Box, Title, Select } from "@mantine/core";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { createAplikasi } from "@/api/hakAkses";
import Breadcrumb from "@/components/BreadCrumb";
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

      router.push("/hak-akses");
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
        Tambah Hak Akses Baru
      </Title>
      <Breadcrumb />
      <form onSubmit={handleSubmit}>
        <TextInput
          label="ID Aplikasi"
          value={app.idaplikasi}
          onChange={(e) => setApp({ ...app, name: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Nama akses"
          value={app.address}
          onChange={(e) => setApp({ ...app, address: e.target.value })}
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
