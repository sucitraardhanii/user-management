"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Title,
  Button,
  Flex,
  Text,
  TagsInput,
  Group,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import GenericTable from "@/components/GenericTable";
import { fetchAplikasi, deleteAplikasi, encryptId } from "@/api/aplikasi";
import StatusBadge from "@/components/StatusAkunBadge";
import { showNotification, updateNotification } from "@mantine/notifications";
import CreateButton from "@/components/CreateButton";
import { modals } from "@mantine/modals";
import ButtonAction from "@/components/ButtonAction";
import PageBreadCrumb from "@/components/PageBreadCrumb";
import AppModal from "@/components/AppModal";
import AppEditModal from "@/components/AppEditModal";
import { isSuperAdmin } from "@/api/auth";
import ForbiddenPage from "@/app/forbidden/page";

export default function AppPage() {
  if (!isSuperAdmin()) {
    return <ForbiddenPage />;
  }

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([]);

  const getAplikasi = async () => {
    try {
      setLoading(true); // opsional, bisa dipindah
      const data = await fetchAplikasi(); // ambil dari API
      setApps(data); // update state
    } catch (err) {
      console.error("Gagal fetch aplikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAplikasi();
  }, []);

  const filteredData = useMemo(() => {
    if (searchTags.length === 0) return apps;
    return apps.filter((item) =>
      searchTags.every((tag) =>
        item.name?.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }, [apps, searchTags]);

  const handleDelete = (id, name) => {
    modals.openConfirmModal({
      title: (
        <Group spacing="xs">
          <ThemeIcon color="red" variant="light" radius="xl" size="lg">
            <IconTrash size={18} />
          </ThemeIcon>
          <Text fw={600} fz="lg">
            Konfirmasi Hapus
          </Text>
        </Group>
      ),
      centered: true,
      size: "sm",
      overlayProps: { blur: 2 },
      children: (
        <Text size="sm" color="dimmed">
          Apakah Anda yakin ingin menghapus aplikasi{" "}
          <Text component="span" fw={600} color="red">
            {name}
          </Text>
          ?
        </Text>
      ),
      labels: {
        confirm: "Hapus",
        cancel: "Batal",
      },
      confirmProps: {
        color: "red",
        variant: "filled",
      },
      cancelProps: {
        variant: "default",
      },
      onConfirm: async () => {
        // Notifikasi loading saat proses hapus
        showNotification({
          id: "delete-aplikasi",
          title: "Menghapus...",
          message: `Sedang menghapus ${name}`,
          loading: true,
          autoClose: false,
          withCloseButton: true,
        });

        try {
          await deleteAplikasi(id); // ganti sesuai fungsi hapus kamu

          updateNotification({
            id: "delete-aplikasi",
            title: "Berhasil",
            message: `${name} berhasil dihapus`,
            color: "teal",
            icon: <IconCheck size={18} />,
            autoClose: 3000,
          });

          // Update tampilan tabel
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
        color: "#2E4070",
        Cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.options.meta || {};
          return (pageIndex ?? 0) * (pageSize ?? 5) + row.index + 1;
        },
      },
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "address", header: "Alamat" },
      { accessorKey: "idaplikasi", header: "ID Aplikasi", size: 100 },
      {
        accessorKey: "encryptedId",
        header: "Encrypted ID",
        size: 125,
        Cell: ({ row }) => {
          const [loading, setLoading] = useState(false);

          const handleEncrypt = async () => {
            setLoading(true);
            try {
              const res = await encryptId(row.original.idaplikasi);
              showNotification({
                title: "Encrypted ID",
                message: `ID: ${row.original.idaplikasi}\n \n Encrypted: ${res}`,
                icon: <IconCheck size={18} />,
                color: "teal",
                autoClose: false,
              });
            } catch (err) {
              showNotification({
                title: "Gagal Encrypt",
                message: `ID: ${row.original.idaplikasi}`,
                color: "red",
              });
            } finally {
              setLoading(false);
            }
          };

          return (
            <Button
              size="xs"
              color="#2E4070"
              loading={loading}
              onClick={handleEncrypt}
            >
              Encrypt
            </Button>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Created At",
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
        header: "Aksi",
        Cell: ({ row }) => (
          <ButtonAction
            onEdit={() => setEditId(row.original.id)}
            onDelete={() => handleDelete(row.original.id, row.original.name)}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <PageBreadCrumb />

      {/* Title dan tombol dalam 1 baris */}
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Daftar Aplikasi</Title>
        <CreateButton
          entity="aplikasi"
          useModal
          onClick={() => setOpened(true)}
        />
      </Flex>
      <TagsInput
        label="Filter berdasarkan Aplikasi"
        placeholder="Ketik dan tekan Enter"
        value={searchTags}
        onChange={setSearchTags}
        clearable
        mb="md"
      />
      <GenericTable
        data={filteredData}
        columns={columns}
        loading={loading}
        defaultPageSize={5}
      />
      <AppModal
        opened={opened}
        onClose={() => setOpened(false)}
        onSuccess={getAplikasi}
      />

      <AppEditModal
        id={editId}
        opened={Boolean(editId)}
        onClose={() => setEditId(null)}
        onSuccess={() => {
          getAplikasi();
          setEditId(null); // tutup modal setelah sukses
        }}
      />
    </>
  );
}
