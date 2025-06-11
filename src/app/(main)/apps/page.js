"use client";

import { useEffect, useMemo, useState } from "react";
import { Title, Button, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import GenericTable from "@/components/GenericTable";
import { fetchAplikasi, deleteAplikasi } from "@/api/aplikasi";
import StatusBadge from "@/components/StatusBadge";
import { showNotification, updateNotification } from "@mantine/notifications";
import CreateButton from "@/components/CreateButton";
import Breadcrumb from "@/components/BreadCrumb";
import { modals } from "@mantine/modals";

export default function AppPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAplikasi()
      .then(setApps)
      .catch((err) => console.error("Gagal fetch aplikasi:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id, name) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus",
      centered: true,
      size: "sm", // biar seperti notifikasi
      overlayProps: { blur: 2, opacity: 0.1 },
      children: (
        <Text size="sm">
          Yakin ingin menghapus <b>{name}</b>?
        </Text>
      ),
      labels: { confirm: "Hapus", cancel: "Batal" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        showNotification({
          id: "delete-aplikasi",
          title: "Menghapus...",
          message: `Sedang menghapus ${name}`,
          loading: true,
          autoClose: false,
          disallowClose: true,
        });

        try {
          await deleteAplikasi(id);

          updateNotification({
            id: "delete-aplikasi",
            title: "Berhasil",
            message: `${name} berhasil dihapus`,
            color: "teal",
            icon: <IconCheck size={18} />,
            autoClose: 3000,
          });

          setApps((prev) => prev.filter((app) => app.id !== id));
        } catch (err) {
          updateNotification({
            id: "delete-aplikasi",
            title: "Gagal",
            message: `Tidak dapat menghapus ${name}`,
            color: "red",
            icon: <IconX size={18} />,
            autoClose: 3000,
          });
        }
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        id: "number",
        header: "No.",
        size: 50,
        Cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.options.meta || {};
          return (pageIndex ?? 0) * (pageSize ?? 5) + row.index + 1;
        },
      },
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "address", header: "Alamat" },
      {
        accessorKey: "status",
        header: "Status",
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
      <Breadcrumb />
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Daftar Aplikasi</Title>
        <CreateButton entity="apps" />
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
