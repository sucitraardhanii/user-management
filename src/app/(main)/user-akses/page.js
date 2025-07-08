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
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

import GenericTable from "@/components/GenericTable";
import StatusBadge from "@/components/StatusBadge";
import NullBadge from "@/components/NullBadge";
import Breadcrumb from "@/components/BreadCrumb";
import CreateButton from "@/components/CreateButton";
import ButtonAction from "@/components/ButtonAction";
import UserAksesEditModal from "@/components/UserAksesEditModal";

import {
  fetchUserAkses,
  fetchAplikasi,
  encryptId,
  deleteUserAkses,
  updateUserAkses,
} from "@/api/userAkses";
import PageBreadCrumb from "@/components/PageBreadCrumb";

export default function UserAksesPage() {
  const [nippos, setNippos] = useState("");
  const [idaplikasi, setIdaplikasi] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    try {
      let encryptedId = "";
      if (idaplikasi) {
        encryptedId = await encryptId(idaplikasi);
      }

      const result = await fetchUserAkses({
        nippos: nippos,
        idaplikasi: encryptedId || "",
      });

      setData(result);
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, nippos) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus",
      centered: true,
      size: "sm",
      overlayProps: { blur: 2, opacity: 0.1 },
      children: (
        <Text size="sm">
          Yakin ingin menghapus <b>{nippos}</b>?
        </Text>
      ),
      labels: { confirm: "Hapus", cancel: "Batal" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        showNotification({
          id: "delete-userakses",
          title: "Menghapus...",
          message: `Sedang menghapus ${nippos}`,
          loading: true,
          autoClose: false,
          withCloseButton: true,
        });

        try {
          await deleteUserAkses(id);

          updateNotification({
            id: "delete-userakses",
            title: "Berhasil",
            message: `${nippos} berhasil dihapus`,
            color: "teal",
            icon: <IconCheck size={18} />,
            autoClose: 3000,
          });

          setData((prev) => prev.filter((item) => item.idAkses !== id));
        } catch (err) {
          updateNotification({
            id: "delete-userakses",
            title: "Gagal",
            message: `Tidak dapat menghapus ${nippos}`,
            color: "red",
            icon: <IconX size={18} />,
            autoClose: 3000,
          });
        }
      },
    });
  };

  const handleEditSubmit = (row) => {
    setSelectedRow(row);
    setNippos(row.nippos);
    setModalOpened(true);
  };

  const handleUpdate = async (editData, values) => {
    try {
      const updatedPayload = {
        id: editData.idAkses,
        nippos: values.nippos,
        idHakAkses:
          typeof editData.idHakAkses === "object"
            ? parseInt(editData.idHakAkses.value)
            : parseInt(editData.idHakAkses),
        statusUserAkses: values.statusUserAkses ? 1 : 0,
      };

      const response = await updateUserAkses(updatedPayload);
      showNotification({
        title: "Berhasil",
        message: "User Berhasil Di Rubah",
        color: "green",
      });
      setModalOpened(false);
      handleFetch();
    } catch (error) {
      toast.error("Gagal update user akses");
      console.error("🔥 Update error:", error);
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
        size: 100,
        Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
        header: "Aksi",
        size: 100,
        Cell: ({ row }) => (
          <Flex gap="xs" wrap="nowrap">
            <ButtonAction
              onEdit={() => {
                setSelectedRow(row.original);
                setModalOpened(true);
              }}
              onDelete={() =>
                handleDelete(row.original.idAkses, row.original.nippos)
              }
            />
          </Flex>
        ),
      },
    ],
    []
  );

  return (
    <>
    <PageBreadCrumb/>
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
              placeholder="Masukkan Nippos"
              style={{ flex: 1 }}
            />
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
        <GenericTable data={data} columns={columns} loading={loading} />
      </Stack>

      <UserAksesEditModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSubmit={(values) => handleUpdate(selectedRow, values)}
        editData={selectedRow}
      />
    </>
  );
}
