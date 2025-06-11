"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Title,
  TextInput,
  Select,
  Button,
  Loader,
} from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { getAplikasiById, updateAplikasi } from "@/api/aplikasi";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import Breadcrumb from "@/components/BreadCrumb";

export default function EditAplikasiPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({ nama: "", alamat: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false); // 🔥 kunci sukses!

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAplikasiById(id);
        console.log("data api", data); // debug

        if (data) {
          setForm({
            nama: data.nama ?? "",
            alamat: data.alamat ?? "",
            status: data.status?.toString() ?? "",
          });
          setReady(true); // ✅ hanya tampil setelah data masuk
        }
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAplikasi(id, form);
      showNotification({
        title: "Berhasil",
        message: "Aplikasi berhasil diperbarui",
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      router.push("/apps");
    } catch (err) {
      console.error("Update gagal:", err);
      showNotification({
        title: "Gagal",
        message: "Gagal update aplikasi",
        color: "red",
      });
    }
  };

  if (loading) return <Loader size="lg" mt="xl" />;
  if (!ready) return <></>; // jangan render form dulu

  return (
    <Box>
      <Title order={2} mb="md">
        Edit Aplikasi
      </Title>
      <Breadcrumb />
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Alamat"
          value={form.alamat}
          onChange={(e) => setForm({ ...form, alamat: e.target.value })}
          required
          mb="sm"
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(val) => setForm({ ...form, status: val })}
          data={[
            { value: "1", label: "Aktif" },
            { value: "0", label: "Tidak Aktif" },
          ]}
          placeholder="Pilih status"
          required
          mb="sm"
        />
        <Button type="submit" mt="md">
          Simpan Perubahan
        </Button>
      </form>
    </Box>
  );
}
