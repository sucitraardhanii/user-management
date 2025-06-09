"use client";

import { useEffect, useMemo, useState } from "react";
import { Paper, Title, Button, Flex, Loader, Center } from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { fetchAplikasi, deleteAplikasi } from "@/lib/api.js"; // ganti pakai API langsung

export default function AppPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchAplikasi()
      .then(setApps)
      .catch((err) => console.error("Gagal fetch aplikasi:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Yakin ingin menghapus ${name}?`)) return;
    try {
      await deleteAplikasi(id);
      setApps((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Gagal menghapus aplikasi:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "number",
        header: "No.",
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          return pageIndex * pageSize + row.index + 1;
        }
      },
      { accessorKey: "name", header: "Nama", enableSorting: false },
      { accessorKey: "address", header: "Alamat", enableSorting: false },
      { accessorKey: "status", header: "Status", enableSorting: false },
      {
        id: "actions",
        header: "Aksi",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <Flex gap="xs" wrap="nowrap">
            <Button
              size="xs"
              compact
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
    [pageIndex, pageSize]
  );

  const renderCustomHeader = ({ column, header }) => (
    <div
      onClick={column.getToggleSortingHandler?.()}
      style={{
        cursor: column.getCanSort?.() ? "pointer" : "default",
        fontWeight: 600,
        textAlign: "right",
        userSelect: "none",
        padding: "8px 12px",
        width: "100%",
      }}
    >
      {header.column.columnDef.header}
    </div>
  );

  if (loading) {
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  }

  const totalRows = apps.length;
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);
  const paginatedData = apps.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  return (
    <>
      <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Daftar Aplikasi</Title>
        <Button component={Link} href="/apps/create">
          +
        </Button>
      </Flex>
      <Paper shadow="xs" p="md" withBorder>
        <MantineReactTable
          columns={columns}
          data={paginatedData}
          enablePagination={false} // Disable default pagination
          enableColumnActions={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableGlobalFilter={true}
          mantinePaperProps={{ shadow: "0", withBorder: false }}
          renderTopToolbarCustomActions={() => (
            <Flex justify="flex-end" w="100%" p="md" />
          )}
          renderColumnHeaderContent={renderCustomHeader}
        />
        <Flex
          justify="flex-end"
          align="center"
          w="100%"
          px="md"
          py="sm"
          gap="sm"
        >
          <span>
            {start}-{end} of {totalRows}
          </span>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0); // Reset to first page when page size changes
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Button.Group>
            <Button
              size="xs"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              {"<<"}
            </Button>
            <Button
              size="xs"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
            >
              {"<"}
            </Button>
            <Button
              size="xs"
              onClick={() =>
                setPageIndex((prev) =>
                  Math.min(prev + 1, Math.floor(totalRows / pageSize))
                )
              }
              disabled={pageIndex >= Math.floor(totalRows / pageSize)}
            >
              {">"}
            </Button>
            <Button
              size="xs"
              onClick={() => setPageIndex(Math.floor(totalRows / pageSize))}
              disabled={pageIndex >= Math.floor(totalRows / pageSize)}
            >
              {">>"}
            </Button>
          </Button.Group>
        </Flex>
      </Paper>
    </>
  );
}
