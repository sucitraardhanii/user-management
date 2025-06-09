"use client";

import { useEffect, useMemo, useState } from "react";
import { Title, Button, Flex } from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import GenericTable from "@/components/GenericTable";
import { fetchAplikasi, deleteAplikasi } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import { showNotification } from "@mantine/notifications";


export default function AppPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAplikasi()
      .then(setApps)
      .catch((err) => console.error("Gagal fetch aplikasi:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Yakin ingin menghapus ${name}?`)) return;
    try {
      await deleteAplikasi(id);
      setApps((prev) => prev.filter((app) => app.id !== id));
      showNotification({
      title: "Berhasil",
      message: "Data berhasil dihapus",
      color: "green",
    });
    } catch (err) {
      console.error("Gagal menghapus aplikasi:", err);
      showNotification({
      title: "Gagal",
      message: "Data Gagal dihapus",
      color: "Red",
    });
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "number",
        header: "No.",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "address", header: "Alamat" },
      { accessorKey: "status", header: "Status",
        Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
        header: "Aksi",
        Cell: ({ row }) => (
          <Flex gap="xs" wrap="nowrap">
            <Button
              size="xs"
              compact
              variant="light"
              color="blue"
              component={Link}
              href={`/apps/${row.original.id}/edit`}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => handleDelete(row.original.id, row.original.name)}
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Daftar Aplikasi</Title>
        <Button component={Link} href="/apps/create">
          +
        </Button>
      </Flex>

      <GenericTable
        data={apps}
        columns={columns}
        loading={loading}
        defaultPageSize={5}
      />
    </>
  );
}
