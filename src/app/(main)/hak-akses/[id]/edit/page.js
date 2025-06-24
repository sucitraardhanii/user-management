"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { fetchHakAkses, updateHakAkses } from "@/api/hakAkses";

// Ambil data hak akses dari filter by app
async function fetchHakAksesById(id, encryptedIdApp) {
  const dataByApp = await fetchHakAkses({ idaplikasi: encryptedIdApp });

  const item = dataByApp.find(
    (d) => d.idhakakses?.toString() === id?.toString()
  );

  if (!item) throw new Error("Data hak akses tidak ditemukan");

  return item;
}

export default function EditHakAksesPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const encryptedIdApp = searchParams.get("idApp");

  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      namaakses: "",
      status: "1",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!encryptedIdApp || encryptedIdApp === "undefined") {
        showNotification({
          title: "ID Aplikasi Tidak Valid",
          message: "Query idapp hilang atau tidak valid.",
          color: "red",
          icon: <IconX />,
        });
        router.push("/hak-akses");
        return;
      }

      setLoading(true);
      try {
        const data = await fetchHakAksesById(id, encryptedIdApp);
        form.setValues({
          namaakses: data.namaakses,
          status: data.status?.toString() || "0",
        });
      } catch (err) {
        console.error("Gagal fetch data hak akses:", err);
        showNotification({
          title: "Gagal",
          message: "Data hak akses tidak ditemukan",
          color: "red",
          icon: <IconX />,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id && encryptedIdApp) {
      loadData();
    }
  }, [id, encryptedIdApp]);

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

  if (loading) return <Loader mt="xl" />;

  return (
    <Paper withBorder p="md" radius="md">
      <Title order={3} mb="md">
        Edit Hak Akses
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Nama Akses"
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
