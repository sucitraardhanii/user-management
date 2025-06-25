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
} from "@mantine/core";
import GenericTable from "@/components/GenericTable";
import { fetchUserByApp } from "@/api/user";
import { fetchAplikasi } from "@/api/aplikasi"; // fungsi ambil aplikasi
import StatusBadge from "@/components/StatusBadge";
import NullBadge from "@/components/NullBadge";
import Breadcrumb from "@/components/BreadCrumb";
import { getIdAplikasi, isSuperAdmin } from "@/api/auth";

export default function UserByAppPage() {
   const [idApp, setIdApp] = useState(() => {
    return isSuperAdmin() ? "" : getIdAplikasi();
  });
  const [activeAccount, setActiveAccount] = useState("all");
  const [data, setData] = useState([]);
  const [aplikasiList, setAplikasiList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil list aplikasi saat pertama render
  useEffect(() => {
    const loadAplikasi = async () => {
      try {
        const res = await fetchAplikasi();
        const apps = res.data?.map((app) => ({
          value: app.idaplikasi,
          label: app.nama,
        }));
        setAplikasiList(apps || []);
      } catch (err) {
        console.error("Gagal ambil aplikasi", err);
      }
    };
    loadAplikasi();
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    try {
      if (!isSuperAdmin()) {
        const idaplikasi = getIdAplikasi();
        setIdApp(idaplikasi)
      }
      console.log("Gagal fetch:", idApp);
      const result = await fetchUserByApp(idApp, activeAccount );
      // setData(result.data);
      const filtered = result.data.filter((user) => user.statusPegawai === "Non Organik");
      setData(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
  ], []);

  return (
    <>
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Manajemen User</Title>
      </Flex>
      <Breadcrumb />
      <Stack>
        <Paper withBorder p="md" radius="md">
          <Flex gap="md" wrap="wrap">
            <Select
              label="Pilih Aplikasi"
              placeholder="Pilih aplikasi"
              data={aplikasiList}
              value={idApp}
              onChange={setIdApp}
              searchable
              style={{ flex: 1 }}
            />
            <TextInput
              label="Status Akun"
              value={activeAccount}
              onChange={(e) => setActiveAccount(e.target.value)}
              placeholder="Contoh: all / 1 / 0"
              style={{ flex: 1 }}
            />
            <Button onClick={handleFetch} mt={20} style={{ height: "40px" }}>
              Tampilkan Data
            </Button>
          </Flex>
        </Paper>

        <GenericTable data={data} columns={columns} loading={loading} />
      </Stack>
    </>
  );
}
