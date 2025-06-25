"use client";

import { useState, useMemo, useEffect } from "react";
import {
  TextInput,
  Button,
  Paper,
  Flex,
  Stack,
  Title,
  Text,
  Select,
  Loader,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import GenericTable from "@/components/GenericTable";
import StatusBadge from "@/components/StatusBadge";
import NullBadge from "@/components/NullBadge";
import CreateButton from "@/components/CreateButton";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { fetchUserAkses, fetchAplikasi, encryptId, deleteUserAkses } from "@/api/userAkses";
import ButtonAction from "@/components/ButtonAction";
import { IconCheck, IconX } from "@tabler/icons-react";
import UserAksesModal from "@/components/UserAksesModal";
import { getIdAplikasi, isSuperAdmin } from "@/api/auth";
import PageBreadCrumb from "@/components/PageBreadCrumb";


export default function UserAksesPage() {
  const [nippos, setNippos] = useState("");
  const [idaplikasi, setIdaplikasi] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [opened, setOpened] = useState(false);


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

  const handleFetch = async () => {
  setLoading(true);
  try {
    if (!isSuperAdmin()) {
      const idaplikasi = getIdAplikasi();
      setIdaplikasi(idaplikasi);

      const result = await fetchUserAkses({
      nippos,
      idaplikasi: idaplikasi,

      });
      setData(result);
      return;
    }

    let encryptedId = "";
    if (idaplikasi){
      encryptedId = await encryptId(idaplikasi);
    }
    
    if (idaplikasi && nippos) {
      encryptedId = await encryptId(idaplikasi);
    }

    const result = await fetchUserAkses({
      nippos,
      idaplikasi: encryptedId || "",
    });

    setData(result);
  } catch (err) {
    console.error("Gagal fetch:", err);
  } finally {
    setLoading(false);
  }
};

const handleDelete = (id, name) => {
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
        id: "delete-userakses",
        title: "Menghapus...",
        message: `Sedang menghapus ${name}`,
        loading: true,
        autoClose: false,
        withCloseButton: true,
      });

      try {
        await deleteUserAkses(id); // pastikan API ini menerima idAkses

        updateNotification({
          id: "delete-userakses",
          title: "Berhasil",
          message: `${name} berhasil dihapus`,
          color: "teal",
          icon: <IconCheck size={18} />,
          autoClose: 3000,
        });

        setData((prev) => prev.filter((item) => item.idAkses !== id));
      } catch (err) {
        updateNotification({
          id: "delete-userakses",
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
        accessorKey: "alamatAplikasi",
        header: "Alamat Aplikasi",
        Cell: ({ cell }) => <NullBadge value={cell.getValue()} />,
      },
      { accessorKey: "idAkses", header: "ID Akses", size: 100 },
      { accessorKey: "idHakAkses", header: "ID Hak Akses", size: 100 },
      { accessorKey: "namaAkses", header: "Nama Akses", size: 150 },
      { accessorKey: "namaAplikasi", header: "Nama Aplikasi" },
      { accessorKey: "nippos", header: "Nippos" },
      {
        accessorKey: "statusUserAkses",
        header: "Status",
        size:100,
        Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
        header: "Aksi",
        size: 100,
        Cell: ({ row }) => (
          <Flex gap="xs" wrap="nowrap">
            {/* <Button
              size="xs"
              variant="light"
              color="blue"
              component={Link}
              href={`/user-akses/${row.original.id}/edit`}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button> */}
            <ButtonAction
              onEdit={() => setEditId(row.original.idAkses)}
              onDelete={() => handleDelete(row.original.idAkses, row.original.namaAkses)}
            />
          </Flex>
        ),
      },
    ],
    []
  );

  return (
    <>
    <PageBreadCrumb />
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>User Akses</Title>
        <CreateButton entity="user-akses" />
      </Flex>

      <Stack>
        <Paper withBorder p="md" radius="md">
          <Flex gap="md" wrap="wrap">
            <TextInput
              label="Nippos"
              value={nippos}
              onChange={(e) => setNippos(e.target.value)}
              placeholder="Cari Menggunakan Nippos/Email"
              style={{ flex: 1 }}
            />
            {isSuperAdmin() && (
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
            )}

            <Button
              onClick={handleFetch}
              mt={20}
              style={{ height: "40px" }}
            >
              Tampilkan Data
            </Button>
          </Flex>
        </Paper>

        <GenericTable data={data} columns={columns} loading={loading} />

      </Stack>
    </>
  );
}
