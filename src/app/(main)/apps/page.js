"use client";

import { useEffect, useMemo } from "react";
import { Paper, Title, Button, Flex, Loader, Center } from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { useAppStore } from "@/store/appStore";

export default function AppPage() {
  const apps = useAppStore((state) => state.apps);
  const fetchApps = useAppStore((state) => state.fetchApps);
  const deleteApp = useAppStore((state) => state.deleteApp);
  const loading = apps.length === 0;

  useEffect(() => {
    fetchApps();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "address", header: "Alamat" },
      { accessorKey: "status", header: "Status" },
      {
        id: "actions",
        header: "Aksi",
        enableSorting: true,
        enableColumnFilter: true,
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
              onClick={() => {
                if (confirm(`Yakin ingin menghapus ${row.original.name}?`)) {
                  deleteApp(row.original.id);
                }
              }}
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    [deleteApp]
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
      <Title order={2} mb="md">
        Daftar Aplikasi
      </Title>
      <Button component={Link} href="/apps/create" mb="md">
        Tambah Aplikasi
      </Button>
      <Paper shadow="xs" p="md" withBorder>
        <MantineReactTable
          columns={columns}
          data={apps}
          mantinePaperProps={{ shadow: "0", withBorder: false }}
        />
      </Paper>
    </>
  );
}
