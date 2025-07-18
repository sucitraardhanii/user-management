// components/GenericTable.js
"use client";

import { MantineReactTable } from "mantine-react-table";
import { Paper, Flex, Button, Loader, Center } from "@mantine/core";
import { useMemo, useState, useEffect } from "react";

export default function GenericTable({
  data = [],
  columns,
  loading = false,
  onEdit,
  onDelete,
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 5,
  enableSearch = false,
  onSearchChange,
  searchPlaceholder = "Cari...",
}) {

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalRows = data.length;
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);
  const paginatedData = data.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );
useEffect(() => {
  setPageIndex(0); // reset ke halaman awal saat data berubah
}, [data]);

  const renderCustomHeader = ({ column, header }) => (
    <div
      onClick={column.getToggleSortingHandler?.()}
      style={{
        cursor: column.getCanSort?.() ? "pointer" : "default",
        fontWeight: 600,
        textAlign: "left",
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

  return (
    <>
      <style jsx global>{`
        .mantine-ActionIcon-root {
          display: none !important;
        }
      `}</style>

      <Paper shadow="xs" p="md" withBorder style={{ overflowX: "auto" }}>
        {enableSearch && (
          <Flex justify="flex-end" mb="sm">
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{
                padding: "6px 12px",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 14,
                width: 240,
              }}
            />
          </Flex>
        )}

        <MantineReactTable
          columns={columns}
          data={paginatedData}
          enablePagination={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableGlobalFilter={true}
          mantinePaperProps={{ shadow: "0", withBorder: false }}
          mantineTableHeadCellProps={{
            style: {
              justifyContent: "flex-start",
              gap: -10,
            },
          }}
          renderTopToolbarCustomActions={() => (
            <Flex justify="flex-end" w="100%" p="md" />
          )}
          renderColumnHeaderContent={renderCustomHeader}
          meta={{ pageIndex, pageSize }}
          state={{
            showEmptyRows: false,
            isLoading: loading,
            showSkeletons: false,
            noRecordsText: "Data tidak ditemukan",
          }}
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
              setPageIndex(0);
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <Button.Group>
            <Button
              size="xs"
              color="#2E4070"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              {"<<"}
            </Button>
            <Button
              size="xs"
              color="#2E4070"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
            >
              {"<"}
            </Button>
            <Button
              size="xs"
              color="#2E4070"
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
              color="#2E4070"
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
