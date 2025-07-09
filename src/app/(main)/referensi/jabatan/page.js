"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Stack,
  Badge,
  Flex,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import GenericTable from "@/components/GenericTable";
import JabatanModal from "@/components/JabatanModal";
import { getJabatan } from "@/api/jabatan";
import PageBreadCrumb from "@/components/PageBreadCrumb";

export default function JabatanPage() {
  const [data, setData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getJabatan();
      if (Array.isArray(res)) {
        setData(res);
      } else {
        showNotification({
          title: "Gagal Fetch",
          message: "Respon dari server tidak valid.",
          color: "red",
        });
      }
    } catch (err) {
      console.error("Gagal fetch jabatan:", err);
      showNotification({
        title: "Gagal Fetch",
        message: "Tidak dapat memuat data terbaru.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []); // tidak akan berubah setiap render

  // ✅ Fetch hanya sekali saat pertama kali mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData(); // dipanggil hanya saat dibutuhkan
  };

  const handleEdit = (item) => {
    setSelected(item);
    setOpened(true);
  };

  const handleAdd = () => {
    setSelected(null);
    setOpened(true);
  };

  const columns = [
    { accessorKey: "code_jabatan", header: "ID" },
    { accessorKey: "namajabatan", header: "Nama Jabatan" },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => {
        const isAktif = cell.getValue() === 1;
        return (
          <Badge color={isAktif ? "green" : "red"} variant="light">
            {isAktif ? "Aktif" : "Nonaktif"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Aksi",
      // Cell: ({ row }) => (
      //   <Button size="xs" onClick={() => handleEdit(row.original)}>
      //     Edit
      //   </Button>
      // ),
    },
  ];

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.namajabatan?.toLowerCase().includes(search.toLowerCase()) ||
        item.code_jabatan?.toLowerCase().includes(search)
      )
    : [];

  return (
    <Stack spacing="md">
      <PageBreadCrumb />
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Daftar Jabatan</Title>
      </Flex>

      <GenericTable
        data={filteredData}
        columns={columns}
        enableSearch
        searchPlaceholder="Cari nama jabatan"
        onSearchChange={setSearch}
        loading={loading}
      />

    </Stack>
  );
}
