"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Title, Center, Loader, Text } from "@mantine/core";
import GenericTable from "@/components/GenericTable";
import { useHakAkses } from "@/store/hakAkses";

export default function AksesPage() {
  const router = useRouter();
  const { akses, fetchHakAkses, deleteAkses } = useHakAkses();

  useEffect(() => {
    fetchHakAkses();
  }, []);

  const columns = [
    { label: "Nama Akses", accessor: "namaAkses" },
    { label: "Nama Aplikasi", accessor: "namaAplikasi" },
    { label: "Status", accessor: "statusAktif" },
  ];

  return (
    <>
      <Title order={2} mb="md">
        Data Hak Akses Aplikasi
      </Title>

      {akses.length === 0 ? (
        <Center h="80vh">
          <Loader />
        </Center>
      ) : (
        <GenericTable
          columns={columns}
          data={akses}
          onAdd={() => router.push("/akses/create")}
          onEdit={(item) => router.push(`/akses/${item.id}/edit`)}
          onDelete={(item) => deleteAkses(item.id)}
        />
      )}
    </>
  );
}
