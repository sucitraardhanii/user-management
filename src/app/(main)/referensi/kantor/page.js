"use client";

import { useState } from "react";
import { TextInput, Stack, Loader, Title, Button, Group, Paper } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import GenericTable from "@/components/GenericTable";
import { fetchKantor } from "@/api/kantor";
import PageBreadCrumb from "@/components/PageBreadCrumb";

export default function KantorPage() {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await fetchKantor(searchInput);
      setData(result?.data || []);
    } catch (err) {
      console.error("Gagal fetch kantor:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "NoPend", accessorKey: "nopend" },
    { header: "Nama Kantor", accessorKey: "namaKantor" },
    { header: "Jenis Kantor", accessorKey: "jnsKantor" },
    { header: "Alamat", accessorKey: "alamat" },
    { header: "Created At", accessorKey: "creatde_at" },
  ];

  return (
    <Stack>
      <PageBreadCrumb/>
      <Title order={2}>Daftar Kantor</Title>

      <Paper withBorder p="md" radius="md">
        <Group align="end">
        <TextInput
          placeholder="Cari Nopend / Nama Kantor"
          icon={<IconSearch size={16} />}
          value={searchInput}
          style={{ flex: 1 }}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
        />
        <Button onClick={handleSearch}>Tampilkan Data</Button>
      </Group>
      </Paper>
      

      {loading ? (
        <Loader mt="md" />
      ) : (
        <GenericTable columns={columns} data={data} showActions={false} />
      )}
    </Stack>
  );
}
