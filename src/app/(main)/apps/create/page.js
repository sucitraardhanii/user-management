"use client";

import { useState } from "react";
import { TextInput, Button, Box, Title, } from "@mantine/core";
import { useRouter } from "next/navigation";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX} from "@tabler/icons-react";
import { createAplikasi } from "@/api/aplikasi";
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
  
      showNotification({
        id:"add-aplikasi",
        title: "Menyimpan...",
        message: "Mohon tunggu, kami sedang menyimpan data",
        loading: true,
        autoClose: false,
        disallowClose: true,
      });
  
      try {
        await createAplikasi(app);
  
        updateNotification({
          id: "add-aplikasi",
          title: "Berhasil",
          message: "Data Aplikasi Berhasil Ditambahkan",
          color: "teal",
          icon: <IconCheck size={18} />,
          autoClose: 3000,
        });
  
        router.push("/apps");
      } catch (err) {
        console.error("Gagal Ditambahkan:", err);
  
        updateNotification({
          id: "add-aplikasi",
          title: "Gagal",
          message: "Data Aplikasi Gagal Ditambahkan",
          color: "red",
          icon: <IconX size={18} />,
          autoClose: 3000,
        });
      }
    };


  return (
    <Box>
      <Title order={2} mb="md">
        Tambah Aplikasi Baru
      </Title>
      <Breadcrumb />
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
        <Button type="submit" mt="md">
          Simpan
        </Button>
      </form>
    </Box>
  );
}
