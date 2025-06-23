"use client";

import { useState } from "react";
import {
  TextInput,
  Button,
  Modal,
  Box,
  Group,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { createAplikasi } from "@/api/aplikasi";

export default function AppModal({ opened, onClose, onSuccess }) {
  const [app, setApp] = useState({
    name: "",
    address: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    showNotification({
      id: "add-aplikasi",
      title: "Menyimpan...",
      message: "Mohon tunggu, kami sedang menyimpan data",
      loading: true,
      autoClose: false,
      withCloseButton: true,
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

      setApp({ name: "", address: "", status: "" });
      onClose();
      onSuccess?.(); // reload list, kalau ada
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
    <Modal opened={opened} onClose={onClose} title="Tambah Aplikasi Baru" centered>
      <Box component="form" onSubmit={handleSubmit}>
        <TextInput
          label="Nama"
          value={app.name}
          onChange={(e) => setApp({ ...app, name: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Alamat URL"
          value={app.address}
          onChange={(e) => setApp({ ...app, address: e.target.value })}
          mb="sm"
        />
        <Group position="right" mt="md">
          <Button variant="default" onClick={onClose}>Batal</Button>
          <Button type="submit">Simpan</Button>
        </Group>
      </Box>
    </Modal>
  );
}
