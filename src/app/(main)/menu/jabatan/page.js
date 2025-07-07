"use client";

import { useEffect, useState } from "react";
import { Button, Stack, Group, Badge } from "@mantine/core";
import GenericTable from "@/components/GenericTable";
import JabatanModal from "@/components/JabatanModal";
import { getJabatan } from "@/api/jabatan";

export default function JabatanPage() {
  const [data, setData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      const res = await getJabatan();
      setData(res || []);
    } catch (error) {
      console.error("Gagal mengambil data jabatan:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleEdit = (item) => {
    setSelected(item);
    setOpened(true);
  };

  const handleAdd = () => {
    setSelected(null);
    setOpened(true);
  };

  const columns = [
    { accessorKey: "code_jabatan", header: "ID" },
    { accessorKey: "namajabatan", header: "Nama Jabatan" },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => {
        const isAktif = cell.getValue() === 1;
        return (
          <Badge color={isAktif ? "green" : "red"} variant="light">
            {isAktif ? "Aktif" : "Nonaktif"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Aksi",
      Cell: ({ row }) => (
        <Button size="xs" onClick={() => handleEdit(row.original)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Stack spacing="md">
      <Group position="left">
        <Button onClick={handleAdd}>+ Tambah Jabatan</Button>
      </Group>

      <GenericTable data={data} columns={columns} />

      <JabatanModal
        opened={opened}
        onClose={() => setOpened(false)}
        initialData={selected}
        refresh={refresh}
      />
    </Stack>
  );
}
