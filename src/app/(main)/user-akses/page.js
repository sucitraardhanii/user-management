"use client";

import { useForm } from "@mantine/form";
import {
    Text,
    TextInput,
    Button,
    Paper,
    Title,
    Flex,
    Loader,
    Center,
} from "@mantine/core";
import { useState } from "react";
import GenericTable from "@/components/GenericTable";
import { fetchUserAkses } from "@/lib/api"; // method POST
import StatusBadge from "@/components/StatusBadge";

export default function UserAksesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      nippos: "",
      idAplikasi: "",
    },

    validate: {
      nippos: (value) => (value ? null : "NIPPOS wajib diisi"),
      idAplikasi: (value) => (value ? null : "Pilih aplikasi"),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await fetchUserAkses(values);
      setData(res.data || []);
    } catch (err) {
      console.error("Gagal fetch user akses:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { accessorKey: "nippos", header: "NIPPOS" },
    { accessorKey: "namaAkses", header: "Nama Akses" },
    { accessorKey: "namaAplikasi", header: "Nama Aplikasi" },
    {
      accessorKey: "statusUserAkses",
      header: "Status",
      Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
    },
  ];

  return (
    <>
      <Title order={2} mb="md">
        Cek User Akses
      </Title>

      <Paper p="md" withBorder mb="lg">
       <form onSubmit={form.onSubmit(handleSubmit)}>
  <Flex gap="md" wrap="wrap">
    <TextInput
      label="NIPPOS"
      w="100%"
      style={{ flex: 1 }}
      {...form.getInputProps("nippos")}
    />
   <TextInput
      label="ID Aplikasi"
      w="100%"
      style={{ flex: 1 }}
      {...form.getInputProps("idAplikasi")}
    />
    <Button type="submit" mt="xs">
      Cari
    </Button>
  </Flex>
</form>

      </Paper>

      <GenericTable data={data} columns={columns} loading={loading} />
    </>
  );
}
