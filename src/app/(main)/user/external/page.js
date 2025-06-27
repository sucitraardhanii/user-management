"use client";

import { useEffect, useState, useMemo } from "react";
import {
  TextInput,
  Button,
  Paper,
  Flex,
  Stack,
  Title,
  Select,
  Loader
} from "@mantine/core";
import GenericTable from "@/components/GenericTable";
import { fetchUserByApp, fetchUserByNippos, updateUser,fetchUserByAppOrg } from "@/api/user";
import { fetchAplikasi } from "@/api/aplikasi"; // fungsi ambil aplikasi
import StatusBadge from "@/components/StatusBadge";
import { getIdAplikasi, isSuperAdmin } from "@/api/auth";
import ButtonAction from "@/components/ButtonAction";
import PageBreadCrumb from "@/components/PageBreadCrumb";
import CreateButton from "@/components/CreateButton";
import UserEditModal from "@/components/UserEditModal";
import { showNotification } from "@mantine/notifications";
import { fetchExternalOrg } from "@/api/regisUserExtern";
import ActionDropDownButton from "@/components/ActionDropDownButton";
import { IconEdit, IconUpload, IconUserCheck,IconUserQuestion } from "@tabler/icons-react";
import { checkActiveUser, validateUser } from "@/api/user";

export default function UserByAppPage() {
   const [idApp, setIdApp] = useState(() => {
    return isSuperAdmin() ? "" : getIdAplikasi();
  });
  //const [activeAccount, setActiveAccount] = useState("all");
  const [data, setData] = useState([]);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [nippos, setNippos] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [externalOrgOptions, setExternalOrgOptions] = useState([]);

  //Buat Edit MOdal
  const [editNippos, setEditNippos] = useState(null);
  const [editOpened, setEditOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Ambil list aplikasi saat pertama render
  useEffect(() => {
  const loadExternalOrg = async () => {
    const data = await fetchExternalOrg(); // sudah dalam format { label, value }
    setExternalOrgOptions(data);
  };

  loadExternalOrg();
}, []);


useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const aplikasi = await fetchAplikasi();
        setAplikasiOptions(aplikasi);
        const organisasi = await fetchExternalOrg();
        setAplikasiOptions(organisasi);
      } catch (err) {
        console.error("Gagal ambil data aplikasi & organisasi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

const handleFetch = async () => {
  setLoading(true);
  try {
    const usedIdApp = isSuperAdmin() ? idApp : getIdAplikasi();

    if (nippos) {
      const result = await fetchUserByNippos(nippos);
      setData(result);
    } else if (selectedOrg) {
      const result = await fetchUserByAppOrg(usedIdApp,selectedOrg);
      setData(result.data);
    } else {
      const result = await fetchUserByApp(usedIdApp);
      const filtered = result.data.filter(user => user.statusPegawai === "Non Organik");
      setData(filtered);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


// Tombol Edit buat Buka modal
const handleEditClick = async (nippos) => {
  try {
    const res = await fetchUserByNippos(nippos);
    if (res.length > 0) {
      setSelectedUser(res[0]);
      setEditOpened(true);
    }
  } catch (err) {
    console.error("Gagal ambil data user", err);
  }
};

  const columns = useMemo(() => [
    { accessorKey: "nippos", header: "Nippos", size: 150 },
    { accessorKey: "nama", header: "Nama", size:100},
    { accessorKey: "email", header: "Email" },
    { accessorKey: "jabatan", header: "Jabatan", size:100},
    { accessorKey: "namaKantor", header: "Nama Kantor" },
    {
      accessorKey: "statusAkun",
      header: "Status Akun",
      size:115,
      Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
    },
    {
      accessorKey: "statusPegawai",
      header: "Status Pegawai",
      size:125,
      Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
    },
    {
      accessorKey: "hakAkses",
      header: "Hak Akses",
      size:100,
      Cell: ({ cell }) => {
        const akses = cell.getValue();
        return akses?.map((a, i) => (
          <StatusBadge key={i} value={a.statusUserAkses} />
        ));
      },
    },
    {
            id: "actions",
            header: "Aksi",
            Cell: ({ row }) => (
              <ButtonAction
                onEdit={() => handleEditClick(row.original.nippos)}
                onDelete={() => handleDelete(row.original.nippos, row.original.name)}
              />
            ),
          },
  ], []);

  return (
    <>
      <PageBreadCrumb />
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Manajemen User</Title>
        <Flex gap="sm">
        <CreateButton entity="user" />
        <ActionDropDownButton
          actions={[
            {
              label: "Cek Status Aktif",
              icon: <IconUserCheck size={16} />,
              type: "modal",
              modalTitle: "Cek Status User Aktif",
              onSubmitNippos: async (nippos) => {
                const res = await checkActiveUser(nippos);
                if (res.statusCode==200){
                  showNotification({
                  title: "Berhasil Check Status",
                  message:"Akun User Aktif",
                  color: "green",
                });
                return
                }
                showNotification({
                  title: "Gagal",
                  message: "Akun User Tidak Aktif",
                  color: "red",
                });
              },
            },
            {
              label: "Validasi Akun",
              icon: <IconUserQuestion size={16} />,
              type: "modal",
              modalTitle: "Validasi Akun",
              onSubmitNippos: async (nippos) => {
                const res = await validateUser(nippos);
                if (res.statusCode==400){
                  showNotification({
                  title: "Gagal Validasi",
                  message: "Akun User Tidak Ditemukan/Ada Kesalahan",
                  color: "red",
                });
                return
                }
                showNotification({
                  title: "Berhasil Validasi akun",
                  message:"Akun User Sudah Aktif",
                  color: "green",
                });
              },
            },
            {
              label: "Export Data",
              icon: <IconUpload size={16} />,
              color: "blue",
              onClick: () => alert("Export jalan"),
            },
          ]}
        />
      </Flex>
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
            <Select
              label="Organisasi Eksternal"
              data={externalOrgOptions}
              value={selectedOrg}
              onChange={setSelectedOrg}
              placeholder="Pilih organisasi"
              searchable
              clearable
              style={{ flex: 1 }}
            />

            <Button onClick={handleFetch} mt={20} style={{ height: "40px" }}>
              Tampilkan Data
            </Button>
          </Flex>
        </Paper>

        <GenericTable data={data} columns={columns} loading={loading} />

          <UserEditModal
            opened={editOpened}
            onClose={() => setEditOpened(false)}
            userData={selectedUser}
            onSubmit={async (updatedUser) => {
              try {
                await updateUser(updatedUser);
                await handleFetch(); // refresh data
                showNotification({
                  title: "Sukses",
                  message: "User berhasil diupdate",
                  color: "teal",
                });
              } catch (err) {
                console.error("Gagal update user", err);
                showNotification({
                  title: "Gagal",
                  message: err.message,
                  color: "red",
                });
              }
              setEditOpened(false);
            }}
          />
      </Stack>
    </>
  );
}
