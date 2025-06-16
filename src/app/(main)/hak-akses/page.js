"use client";

import { useEffect, useMemo, useState } from "react";
import { Title, Button, Flex, TextInput, TagsInput   } from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import GenericTable from "@/components/GenericTable";
import { deleteHakAkses, fetchHakAkses } from "@/api/hakAkses";
import StatusBadge from "@/components/StatusBadge";
import Breadcrumb from "@/components/BreadCrumb";
import CreateButton from "@/components/CreateButton";


export default function AppPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState([]);
  
  useEffect(() => {
    fetchHakAkses()
      .then(setApps)
      .catch((err) => console.error("Gagal fetch aplikasi:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Yakin ingin menghapus ${name}?`)) return;
    try {
      await deleteHakAkses(id);
      setApps((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Gagal menghapus aplikasi:", err);
    }
  };

  const filteredData = useMemo(() => {
  if (searchTags.length === 0) return apps;

  return apps.filter((item) =>
    searchTags.every((tag) =>
      (item.namaAkses?.toLowerCase().includes(tag.toLowerCase()) ||
       item.namaAplikasi?.toLowerCase().includes(tag.toLowerCase()))
    )
  );
}, [apps, searchTags]);

  const columns = useMemo(
    () => [
      {
        id: "number",
        header: "No.",
        size: 50,
        Cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.options.meta || {};
          return (pageIndex ?? 0) * (pageSize ?? 5) + row.index + 1;
        },
      },
      { accessorKey: "namaAkses", header: "Nama" },
      { accessorKey: "namaAplikasi", header: "Nama Aplikasi" },
      {
        accessorKey: "statusAktif",
        header: "Status",
        Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
        header: "Aksi",
        Cell: ({ row }) => (
          <Flex gap="xs" wrap="nowrap">
            <Button
              size="xs"
              variant="light"
              color="blue"
              component={Link}
              href={`/apps/${row.original.id}/edit`}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => handleDelete(row.original.id, row.original.name)}
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Hak Akses</Title>
        <CreateButton entity="hak-akses" />
      </Flex>
       <Breadcrumb />
      {/* <TagsInput label="Filter berdasarkan Nama Akses / Aplikasi" placeholder="Ketik dan tekan Enter"
      value={searchTags}
      onChange={setSearchTags}
      clearable
      mb="md"
    /> */}
      <GenericTable
        data={filteredData}
        columns={columns}
        loading={loading}
        defaultPageSize={5}
      />
    </>
  );
}