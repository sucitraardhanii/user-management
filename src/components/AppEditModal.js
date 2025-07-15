"use client";

import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  Loader,
  Switch,
  Modal,
  ThemeIcon,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { getAplikasiById, updateAplikasi } from "@/api/aplikasi";
import { IconPencil } from "@tabler/icons-react";

export default function AppEditModal({ id, opened, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    status: "",
  });

  useEffect(() => {
    if (!id || !opened) return;

    setLoading(true);
    getAplikasiById(id)
      .then((data) => {
        const newData = {
          nama: data.nama || "",
          alamat: data.alamat || "",
          status: data.status || "",
        };

        // Cek apakah data berubah sebelum set
        setFormData((prev) => {
          const isSame =
            prev.nama === newData.nama &&
            prev.alamat === newData.alamat &&
            prev.status === newData.status;
          return isSame ? prev : newData;
        });
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
        showNotification({
          title: "Error",
          message: "Gagal mengambil data aplikasi",
          color: "red",
        });
      })
      .finally(() => setLoading(false));
  }, [id, opened]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAplikasi({ idaplikasi: id, ...formData });
      showNotification({
        title: "Berhasil",
        message: "Data aplikasi berhasil diperbarui",
        color: "green",
      });
      onSuccess?.(); // panggil fungsi refresh
      onClose(); // tutup modal
    } catch (err) {
      showNotification({
        title: "Gagal",
        message: "Gagal update aplikasi",
        color: "red",
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
          marginTop: "-20px", // hilangkan jarak bawah header
          marginBottom: "5px", // tambahkan jarak bawah header
        },
      }}
      title={
        <Group spacing="xs" align="center">
          <ThemeIcon color="blue" variant="light" radius="xl" size="md">
            <IconPencil size={18} />
          </ThemeIcon>
          <Text fw={600} fz="xl">
            Edit Aplikasi
          </Text>
        </Group>
      }
    >
      {loading ? (
        <Loader mt="md" />
      ) : (
        <Box component="form" onSubmit={handleSubmit} p="sm">
          <TextInput
            label="Nama"
            value={formData.nama}
            onChange={(e) => handleChange("nama", e.target.value)}
            required
            mt="md"
          />
          <TextInput
            label="Alamat"
            value={formData.alamat}
            onChange={(e) => handleChange("alamat", e.target.value)}
            required
            mt="md"
          />
          <Group spacing="sm" mt="md">
            <Switch
              checked={formData.status === "1"}
              onChange={(e) =>
                handleChange("status", e.currentTarget.checked ? "1" : "0")
              }
              size="md"
            />
            <Text>{formData.status === "1" ? "Aktif" : "Tidak Aktif"}</Text>
          </Group>
          <Group mt="md" position="right">
            <Button
              variant="outline"
              color="gray"
              radius="md"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              radius="md"
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
      )}
    </Modal>
  );
}
