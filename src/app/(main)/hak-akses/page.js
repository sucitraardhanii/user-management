"use client";

import { useState } from "react";
import { Button, Paper, Stack, Select, Flex, Text } from "@mantine/core";
import GenericTable from "@/components/GenericTable";
import { deleteHakAkses, fetchHakAkses } from "@/api/hakAkses";
import StatusBadge from "@/components/StatusBadge";
import Breadcrumb from "@/components/BreadCrumb";
import CreateButton from "@/components/CreateButton"; 


export default function HakAksesPage() {
  const [idApp, setIdApp] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columnsAll = [
    { accessorKey: "idhakakses", header: "ID" },
    { accessorKey: "namaakses", header: "Nama Akses" },
    { accessorKey: "namaaplikasi", header: "Nama Aplikasi" },
    { accessorKey: "status", header: "Status" },
  ];

  const columnsByApp = [
    { accessorKey: "idhakakses", header: "ID" },
    { accessorKey: "namaakses", header: "Nama Akses" },
    { accessorKey: "status", header: "Status" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = idApp ? await getHakAksesByApp(idApp) : await getHakAksesAll();
      setData(result?.data || []);
    } catch (error) {
      console.error("Gagal fetch data hak akses", error);
    }
    setLoading(false);
  };

  return (
    <Paper p="md" withBorder>
      <Stack spacing="md">
        <Text fw={500}>Pencarian Hak Akses</Text>

        <Flex gap="sm" align="flex-end">
          <Select
            label="Pilih Aplikasi (Opsional)"
            placeholder="ID Aplikasi"
            value={idApp}
            onChange={setIdApp}
            data={[
              { value: "MkYCK2kBErcUVDO0ygpt_w==", label: "App 1" },
              { value: "MIpfPTKyBy5HqSLZ7n01Nw==", label: "App 2" },
              // Tambahkan data sesuai kebutuhan
            ]}
            clearable
          />

          <Button onClick={fetchData}>Cari</Button>
        </Flex>

        <GenericTable
          columns={idApp ? columnsByApp : columnsAll}
          data={data}
          loading={loading}
          enableGlobalFilter={true}
          enableColumnFilters={true}
        />
        
         <GenericTable
          columns={columnsAll}
          data={data}
          loading={loading}
          enableGlobalFilter={true}
          enableColumnFilters={true}
        />
      </Stack>
    </Paper>
  );
}
