"use client";

import { useState } from "react";
import {
  TextInput,
  Button,
  Modal,
  Box,
  Group,
  Switch,
  ThemeIcon,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { createAplikasi } from "@/api/aplikasi";
import { IconPlus } from "@tabler/icons-react";

export default function AppModal({ opened, onClose, onSuccess }) {
  const [app, setApp] = useState({
    name: "",
    address: "",
    status: "Aktif",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    showNotification({
      id: "add-aplikasi",
      title: "Menyimpan...",
      message: "Mohon tunggu, sedang menyimpan data aplikasi",
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });

    try {
      await createAplikasi(app);

      updateNotification({
        id: "add-aplikasi",
        title: "Berhasil",
        message: "Aplikasi berhasil ditambahkan",
        color: "teal",
        icon: <IconCheck size={18} />,
        autoClose: 3000,
      });

      setApp({ name: "", address: "", status: "Aktif" });
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Gagal Ditambahkan:", err);
      updateNotification({
        id: "add-aplikasi",
        title: "Gagal",
        message: "Gagal menambahkan aplikasi",
        color: "red",
        icon: <IconX size={18} />,
        autoClose: 3000,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      overlayProps={{ blur: 2 }}
      styles={{
        header: {
          marginTop: "-10px", // hilangkan jarak bawah header
          marginBottom: "5px", // tambahkan jarak bawah header
        },
      }}
      title={
        <Group spacing="xs" align="center">
          <ThemeIcon color="blue" variant="light" radius="xl" size="md">
            <IconPlus size={18} />
          </ThemeIcon>
          <Text fw={600} fz="xl">
            Tambah Aplikasi
          </Text>
        </Group>
      }
    >
      <Box component="form" onSubmit={handleSubmit} p="sm">
        <Stack>
          <TextInput
            label="Nama Aplikasi"
            placeholder="Masukkan nama aplikasi"
            value={app.name}
            onChange={(e) => setApp({ ...app, name: e.target.value })}
            required
          />
          <TextInput
            label="Alamat URL"
            placeholder="Contoh: https://example.com"
            value={app.address}
            onChange={(e) => setApp({ ...app, address: e.target.value })}
            required
          />
          <Switch
            label={`${app.status === "Aktif" ? "Aktif" : "Tidak Aktif"}`}
            checked={app.status === "Aktif"}
            onChange={(event) =>
              setApp({
                ...app,
                status: event.currentTarget.checked ? "Aktif" : "Tidak Aktif",
              })
            }
            mt="xs"
          />
        </Stack>

        <Group mt="md" position="right">
          <Button variant="default" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            styles={{
              root: {
                backgroundColor: "#1C2D5A",
                "&:hover": { backgroundColor: "#162447" },
              },
            }}
          >
            Simpan
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
