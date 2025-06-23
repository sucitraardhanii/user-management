"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Box,
  Title,
  Group,
  Select,
  Loader,
  Center,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import {
  getHakAksesByID,
  updateHakAkses,
  deleteHakAkses,
} from "@/api/hakAkses";

export default function EditHakAksesPage() {
  const { id } = useParams();
  const router = useRouter();
  const idhakakses = id ? Number(id) : null;
  const [loading, setLoading] = useState(true);

  const [hakAkses, setHakAkses] = useState({
    namaakses: "",
    status: 1,
  });

  useEffect(() => {
    getHakAksesByID(idhakakses)
      .then(setHakAkses)
      .catch((err) => console.error("Gagal ambil data hak akses:", err))
      .finally(() => setLoading(false));
  }, [idhakakses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateHakAkses(idhakakses, namaakses);
      showNotification({
        title: "Berhasil",
        message: "Data hak akses berhasil diperbarui",
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      router.push("/hak-akses");
    } catch (err) {
      console.error("Gagal update:", err);
      showNotification({
        title: "Gagal",
        message: "Tidak dapat menyimpan perubahan",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm(`Yakin ingin menghapus hak akses #${namaakses}?`);
    if (!confirmed) return;

    try {
      await deleteHakAkses(idhakakses);
      showNotification({
        title: "Dihapus",
        message: `Hak akses #${namaakses} berhasil dihapus`,
        color: "red",
      });
      router.push("/hak-akses");
    } catch (err) {
      console.error("Gagal hapus:", err);
      showNotification({
        title: "Gagal",
        message: "Tidak dapat menghapus hak akses",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Box maw={500} mx="auto">
      <Title order={2} mb="lg" ta="center">
        Edit Hak Akses #{idhakakses}
      </Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nama Akses"
          value={hakAkses.namaakses}
          onChange={(e) =>
            setHakAkses({ ...hakAkses, namaakses: e.target.value })
          }
          required
          mb="sm"
        />
        <Select
          label="Status"
          value={String(hakAkses.statusHakAkses)}
          onChange={(value) =>
            setHakAkses({ ...hakAkses, status: Number(value) })
          }
          data={[
            { value: "1", label: "Aktif" },
            { value: "0", label: "Nonaktif" },
          ]}
          placeholder="Pilih Status"
          mb="sm"
        />
        <Group mt="md">
          <Button type="submit" mt="md">
            Simpan Perubahan
          </Button>
          <Button variant="outline" color="red" onClick={handleDelete}>
            Hapus Hak Akses
          </Button>
        </Group>
      </form>
    </Box>
  );
}
