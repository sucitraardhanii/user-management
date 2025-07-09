"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Paper,
  Flex,
  Stack,
  Title,
  Text,
  Select,
  Loader,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import GenericTable from "@/components/GenericTable";
import StatusBadge from "@/components/StatusAkunBadge";
import Breadcrumb from "@/components/BreadCrumb";
import CreateButton from "@/components/CreateButton";
import { modals } from "@mantine/modals";
import {
  fetchHakAkses,
  fetchAplikasi,
  encryptId,
  deleteHakAkses,
} from "@/api/hakAkses";
import { IconCheck, IconX } from "@tabler/icons-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import PageBreadCrumb from "@/components/PageBreadCrumb";

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

  const handleDelete = (idhakakses, name) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus",
      centered: true,
      size: "sm",
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
          id: "delete-hakakses",
          title: "Menghapus...",
          message: `Sedang menghapus ${name}`,
          loading: true,
          autoClose: false,
          withCloseButton: true,
        });

        try {
          await deleteHakAkses(idhakakses); // pastikan API ini menerima idAkses

          updateNotification({
            id: "delete-hakakses",
            title: "Berhasil",
            message: `${name} berhasil dihapus`,
            color: "teal",
            icon: <IconCheck size={18} />,
            autoClose: 3000,
          });

          setData((prev) => prev.filter((item) => item.idhakakses !== idhakakses));
        } catch (err) {
          updateNotification({
            id: "delete-hakakses",
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

  const columns = useMemo(
    () => [
      { accessorKey: "idhakakses", header: "ID Hak Akses", size: 100 },
      { accessorKey: "namaakses", header: "Nama Akses", size: 150 },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
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
              href={`/hak-akses/${row.original.idhakakses}/edit?idApp=${idaplikasi}`}
              leftSection={<IconEdit size={14} />}
              disabled={!idaplikasi}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() =>
                handleDelete(row.original.idhakakses, row.original.namaakses)
              }
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    [idaplikasi]
  );

  return (
    <>
    <PageBreadCrumb/>
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
            <Button color="#2E4070" onClick={handleFetch} mt={20} style={{ height: "40px" }}>
              Tampilkan Data
            </Button>
          </Flex>
        </Paper>

        <GenericTable data={data} columns={columns} loading={loading} />
      </Stack>
    </>
  );
}
