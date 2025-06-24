"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Text,
  Button,
  Paper,
  Flex,
  Stack,
  Title,
  Select,
  Loader,
} from "@mantine/core";
import { IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import GenericTable from "@/components/GenericTable";
import StatusBadge from "@/components/StatusBadge";
import Breadcrumb from "@/components/BreadCrumb";
import CreateButton from "@/components/CreateButton";
import Link from "next/link";
import { fetchHakAkses, fetchAplikasi, encryptId, deleteHakAkses } from "@/api/hakAkses";
import { showNotification, updateNotification } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function HakAksesPage() {
  const [idaplikasi, setIdaplikasi] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);

  const handleFetch = async () => {
    setLoading(true);
    try {
      let encryptedId = "";
      if (idaplikasi) {
        encryptedId = await encryptId(idaplikasi);
      }

      const result = await fetchHakAkses({
        idaplikasi: encryptedId || "",
      });

      setData(result);
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const aplikasi = await fetchAplikasi();
        setAplikasiOptions(aplikasi);
      } catch (err) {
        console.error("Gagal ambil data aplikasi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

   const handleDelete = (id, namaakses) => {
      modals.openConfirmModal({
        title: "Konfirmasi Hapus",
        centered: true,
        size: "sm",
        overlayProps: { blur: 2, opacity: 0.1 },
        children: (
          <Text size="sm">
            Yakin ingin menghapus <b>{namaakses}</b>?
          </Text>
        ),
        labels: { confirm: "Hapus", cancel: "Batal" },
        confirmProps: { color: "red" },
        onConfirm: async () => {
          showNotification({
            id: "delete-aplikasi",
            title: "Menghapus...",
            message: `Sedang menghapus ${namaakses}`,
            loading: true,
            autoClose: false,
          });
  
          try {
            await deleteHakAkses(idhakakses);
  
            updateNotification({
              id: "delete-aplikasi",
              title: "Berhasil",
              message: `${namaakses} berhasil dihapus`,
              color: "teal",
              icon: <IconCheck size={18} />,
              autoClose: 3000,
            });
  
            setData((prev) => prev.filter((item) => item.id !== id));
          } catch (err) {
            updateNotification({
              id: "delete-aplikasi",
              title: "Gagal",
              message: `Tidak dapat menghapus ${namaakses}`,
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
      { accessorKey: "idhakakses", header: "ID Hak Akses", size: 100 },
      { accessorKey: "namaakses", header: "Nama Akses", size: 150 },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
        header: "Aksi",
        size: 100,
        Cell: ({ row }) => (
          <Flex gap="xs" wrap="nowrap">
            <Button
              size="xs"
              variant="light"
              color="blue"
              component={Link}
              href={`/hak-akses/${row.original.id}/edit`}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => handleDelete(row.original.id, row.original.namaakses)}
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
        <Title order={2}>Hak Akses</Title>
        <CreateButton entity="hak-akses" />
      </Flex>

      <Stack>
        <Paper withBorder p="md" radius="md">
          <Flex gap="md" wrap="wrap">
            <Select
              label="Pilih Aplikasi"
              data={aplikasiOptions}
              value={idaplikasi}
              onChange={setIdaplikasi}
              placeholder="Pilih aplikasi"
              searchable
              clearable
              disabled={loading}
              rightSection={loading ? <Loader size="xs" /> : null}
              style={{ flex: 1 }}
            />
            <Button onClick={handleFetch} mt={20} style={{ height: "40px" }}>
              Tampilkan Data
            </Button>
          </Flex>
        </Paper>

        <Breadcrumb />
        <GenericTable data={data} columns={columns} loading={loading} />
      </Stack>
    </>
  );
}
