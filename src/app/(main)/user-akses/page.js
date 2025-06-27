"use client";

import { useState, useMemo, useEffect } from "react";
// useState untuk menyimpan state seperti nippos, data, loading, dll.
// useMemo untuk menghindari render ulang kolom tabel yang tidak perlu.
// useEffect untuk mengambil data aplikasi saat komponen pertama kali dimuat.
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
// Komponen GenericTable untuk menampilkan data dalam bentuk tabel.
import StatusBadge from "@/components/StatusBadge";
// Komponen StatusBadge untuk menampilkan status akses dengan badge.
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
import toast from "react-hot-toast";

export default function UserAksesPage() {
  const [nippos, setNippos] = useState("");
  const [idaplikasi, setIdaplikasi] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  // Modal Edit
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // State untuk menyimpan data yang dipilih untuk diedit.
  // nippos, idaplikasi, dan data untuk menyimpan hasil fetch.
  // selectedRow untuk menyimpan baris yang dipilih untuk diedit.

  const handleFetch = async () => {
    setLoading(true);
    try {
      let encryptedId = "";
      if (idaplikasi) {
        encryptedId = await encryptId(idaplikasi);
      }

      const result = await fetchUserAkses({
        nippos : nippos,
        idaplikasi: encryptedId || "",
      });

      setData(result);
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  };
  // untuk mengenkripsi ID aplikasi jika ada, lalu mengambil data user akses berdasarkan nippos dan idaplikasi yang diberikan, lalu hasil ke state data.

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
          await deleteUserAkses(id);

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
  // untuk menampilkan modal konfirmasi sebelum menghapus data, jika pengguna mengonfirmasi, maka akan menghapus data dengan ID yang diberikan dan memperbarui state data.

  const handleEditSubmit = (row) => {
    setSelectedRow(row);
    setNippos(row.nippos);
    setModalOpened(true);
  };

  const handleUpdate = async (editData, values) => {
    console.log("Sending update:", {
      id: editData.idAkses,
      idHakAkses: editData.idHakAkses, // ID Hak Akses yang tidak berubah
      nippos: values.nippos,
      statusUserAkses: values.statusUserAkses ? 1 : 0,
    });

    try {
      const updatedPayload = {
        id: editData.idAkses, // ID akses yang akan diupdate
        nippos: values.nippos, // nippos tidak diubah di form
        idHakAkses:
          typeof editData.idHakAkses === "object"
            ? parseInt(editData.idHakAkses.value)
            : parseInt(editData.idHakAkses),
        statusUserAkses: values.statusUserAkses ? 1 : 0,
      };

      console.log("🟡 Payload update:", updatedPayload);

      const response = await updateUserAkses(updatedPayload);
      console.log("🟢 Respons dari backend:", response);

      toast.success("User akses berhasil diupdate");

      setModalOpened(false); // tutup modal
      handleFetch(); // fetch ulang data agar tabel terupdate
    } catch (error) {
      toast.error("Gagal update user akses");
      console.error("🔥 Update error:", error);
    }
  };
  // untuk mengirim data yang telah diperbarui ke server, menampilkan notifikasi sukses atau gagal, menutup modal, dan memperbarui data yang ditampilkan di tabel.

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
  // untuk mengambil data aplikasi saat komponen pertama kali dimuat, menyimpan hasilnya ke state aplikasiOptions.

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
                console.log("Row clicked:", row.original); // cek apakah idAkses ada
                setSelectedRow(row.original);
                setModalOpened(true);
              }}
              onDelete={() =>
                handleDelete(row.original.idAkses, row.original.namaAkses)
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
        <Breadcrumb />
        <GenericTable data={data} columns={columns} loading={loading} />
      </Stack>

      {/* Modal Edit */}
      <UserAksesEditModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSubmit={(values) => handleUpdate(selectedRow, values)}
        editData={selectedRow}
      />
    </>
  );
}
// Flex: Header + Tombol Buat
// Paper: Form Filter (Nippos + Aplikasi)
// GenericTable: Tabel Data User Akses
// UserAksesEditModal: Modal untuk mengedit data user akses
