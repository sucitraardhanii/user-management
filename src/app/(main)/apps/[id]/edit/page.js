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
} from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { getAplikasiById, updateAplikasi } from "@/api/aplikasi";
import { showNotification } from "@mantine/notifications";

export default function EditAplikasiPage() {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/")[2]; // /apps/3/edit -> ambil "3"

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    status: "1",
  });

  useEffect(() => {
    if (!id) return;
    getAplikasiById(id)
      .then((data) => {
        setFormData({
          nama: data.nama || "",
          alamat: data.alamat || "",
          status: data.status || "1",
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
  }, [id]);

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
      router.push("/apps");
    } catch (err) {
      showNotification({
        title: "Gagal",
        message: "Gagal update aplikasi",
        color: "red",
      });
    }
  };

  if (loading) return <Loader mt="md" />;

  return (
    <Box maw={500} mx="auto" mt="md">
      <Title order={3}>Edit Aplikasi</Title>
      <form onSubmit={handleSubmit}>
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
          <Button variant="default" onClick={() => router.push("/apps")}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
