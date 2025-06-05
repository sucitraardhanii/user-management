"use client";

import { useState } from "react";
import { TextInput, Button, Box, Title, Select } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

export default function CreateAppPage() {
  const router = useRouter();
  const addApp = useAppStore((state) => state.addApp);

  const [app, setApp] = useState({
    name: "",
    address: "",
    status: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addApp(app); // menambah ke store Zustand
    // Simulasi pengiriman data
    // alert(
    //   `User baru dibuat: \n\nNama: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`
    // );
    router.push("/apps");
  };

  showNotification({
    title: 'Berhasil',
    message: 'Data aplikasi berhasil ditambahkan',
    color: 'teal',
    icon: <IconCheck size={18} />,
  });


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
            {value: 'Aktif', label: 'Aktif'},
            {value:'Tidak Aktif', label: 'Tidak Aktif'},
          ]}
          placeholder="Pilih Status"
          mb="sm"
        />
        <Button type="submit" mt="md">
          Simpan
        </Button>
      </form>
    </Box>
  );
}
