"use client";

import { useParams, useRouter } from "next/navigation";
import {
  TextInput,
  Select,
  Button,
  Stack,
  Paper,
  Title,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { updateHakAkses } from "@/api/hakAkses";

export default function EditHakAksesPage() {
  const { id } = useParams();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      namaakses: "",
      status: "1", // default aktif
    },
  });

  const handleSubmit = async (values) => {
    try {
      await updateHakAkses(id, values);
      showNotification({
        title: "Berhasil",
        message: "Data hak akses berhasil diperbarui",
        color: "teal",
        icon: <IconCheck />,
      });
      router.push("/hak-akses");
    } catch (err) {
      console.error("Gagal update:", err);
      showNotification({
        title: "Gagal",
        message: "Terjadi kesalahan saat update data",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Title order={3} mb="md">
        Edit Hak Akses
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Nama Akses"
            placeholder="Masukkan nama akses baru"
            {...form.getInputProps("namaakses")}
            required
          />
          <Select
            label="Status"
            data={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Nonaktif" },
            ]}
            {...form.getInputProps("status")}
            required
          />
          <Button type="submit">Simpan Perubahan</Button>
        </Stack>
      </form>
    </Paper>
  );
}
