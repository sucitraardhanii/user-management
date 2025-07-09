"use client";

import { useState } from "react";
import { TextInput, Stack, Loader, Title, Button, Group } from "@mantine/core";
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
      <PageBreadCrumb items={["Master Data", "Daftar Kantor"]} />
      <Title order={2}>Daftar Kantor</Title>

      <Group grow>
        <TextInput
          placeholder="Cari Nopend / Nama Kantor"
          icon={<IconSearch size={16} />}
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
        />
        <Button onClick={handleSearch}>Cari</Button>
      </Group>

      {loading ? (
        <Loader mt="md" />
      ) : (
        <GenericTable columns={columns} data={data} showActions={false} />
      )}
    </Stack>
  );
}
