"use client";

import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  Loader,
  Title,
  Select,
  Modal,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { getAplikasiById, updateAplikasi } from "@/api/aplikasi";

export default function AppEditModal({ id, opened, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    status: "1",
  });

  useEffect(() => {
    if (!id || !opened) return;

    setLoading(true);
    getAplikasiById(id)
      .then((data) => {
        const newData = {
          nama: data.nama || "",
          alamat: data.alamat || "",
          status: data.status || "1",
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
      onClose();     // tutup modal
    } catch (err) {
      showNotification({
        title: "Gagal",
        message: "Gagal update aplikasi",
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Aplikasi" centered>
      {loading ? (
        <Loader mt="md" />
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
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
          <Select
            label="Status"
            data={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Tidak Aktif" },
            ]}
            value={formData.status}
            onChange={(value) => handleChange("status", value)}
            required
            mt="md"
          />
          <Group mt="xl" position="apart">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </Group>
        </Box>
      )}
    </Modal>
  );
}
