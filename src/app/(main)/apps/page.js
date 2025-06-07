"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Title,
  Button,
  Flex,
  Loader,
  Center,
} from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { fetchAplikasi, deleteAplikasi } from "@/lib/api.js"; // ganti pakai API langsung

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
    } catch (err) {
      console.error("Gagal menghapus aplikasi:", err);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Nama", enableSorting: false },
      { accessorKey: "address", header: "Alamat", enableSorting: false },
      { accessorKey: "status", header: "Status", enableSorting: false },
      {
        id: "actions",
        header: "Aksi",
        enableSorting: false,
        enableColumnFilter: false,
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

  const renderCustomHeader = ({ column, header }) => (
    <div
      onClick={column.getToggleSortingHandler?.()}
      style={{
        cursor: column.getCanSort?.() ? "pointer" : "default",
        fontWeight: 600,
        textAlign: "right",
        userSelect: "none",
        padding: "8px 12px",
        width: "100%",
      }}
    >
      {header.column.columnDef.header}
    </div>
  );

  if (loading) {
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Daftar Aplikasi</Title>
        <Button component={Link} href="/apps/create">
          Tambah Aplikasi
        </Button>
      </Flex>
      <Paper shadow="xs" p="md" withBorder>
        <MantineReactTable
          columns={columns}
          data={apps}
          enableSorting
          mantinePaperProps={{ shadow: "0", withBorder: false }}
          renderColumnHeaderContent={renderCustomHeader}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableGlobalFilter={true}
          renderTopToolbarCustomActions={({ table }) => (
            <Flex justify="flex-end" w="100%" p="md"></Flex>
          )}
        />
      </Paper>
    </>
  );
}
