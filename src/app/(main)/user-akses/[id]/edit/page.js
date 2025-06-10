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
  getUserAksesByID,
  updateUserAkses,
  deleteUserAkses,
} from "@/api/api.js";

export default function EditUserAksesPage() {
  const { id } = useParams();
  const router = useRouter();
  const aksesId = id ? Number(id) : null;
  const [loading, setLoading] = useState(true);

  const [userAkses, setUserAkses] = useState({
    nippos: "",
    statusUserAkses: 1,
  });

  useEffect(() => {
    getUserAksesByID(aksesId)
      .then(setUserAkses)
      .catch((err) => console.error("Gagal ambil data user akses:", err))
      .finally(() => setLoading(false));
  }, [aksesId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserAkses(aksesId, userAkses);
      showNotification({
        title: "Berhasil",
        message: "Data user akses berhasil diperbarui",
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      router.push("/user-akses");
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
    const confirmed = confirm(`Yakin ingin menghapus user akses #${aksesId}?`);
    if (!confirmed) return;

    try {
      await deleteUserAkses(aksesId);
      showNotification({
        title: "Dihapus",
        message: `User akses #${aksesId} berhasil dihapus`,
        color: "red",
      });
      router.push("/user-akses");
    } catch (err) {
      console.error("Gagal hapus:", err);
      showNotification({
        title: "Gagal",
        message: "Tidak dapat menghapus user akses",
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
        Edit User Akses #{aksesId}
      </Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nippos"
          value={userAkses.nippos}
          onChange={(e) =>
            setUserAkses({ ...userAkses, nippos: e.target.value })
          }
          required
          mb="sm"
        />
        <Select
          label="Status"
          value={String(userAkses.statusUserAkses)}
          onChange={(value) =>
            setUserAkses({ ...userAkses, statusUserAkses: Number(value) })
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
            Hapus User Akses
          </Button>
        </Group>
      </form>
    </Box>
  );
}
