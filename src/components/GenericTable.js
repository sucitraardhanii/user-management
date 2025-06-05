"use client";

import {
  Table,
  ScrollArea,
  Paper,
  Checkbox,
  Group,
  Text,
  Button,
  Pagination,
  TextInput,
  Select,
  Badge,
  Flex,
} from "@mantine/core";
import { useState, useMemo } from "react";
import {
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import clsx from "clsx";

export default function GenericTable({
  columns,
  data,
  rowKey = "id",
  defaultLimit = 10,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [limit, setLimit] = useState(String(defaultLimit));
  const [page, setPage] = useState(1);

  const itemsPerPage = parseInt(limit);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filtered = useMemo(() => {
    return data.filter((item) =>
      columns.some((col) =>
        item[col.accessor]?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [filtered, sortConfig]);

  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const allIds = paginated.map((item) => item[rowKey]);
  const allSelected = allIds.every((id) => selected.includes(id));

  const toggleAll = () => {
    setSelected((prev) =>
      allSelected ? prev.filter((id) => !allIds.includes(id)) : [...prev, ...allIds]
    );
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <TextInput
          placeholder="Cari..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Group>
          {onAdd && (
            <Button color="green" onClick={onAdd}>
              Tambah Data
            </Button>
          )}
          <Select
            data={["10", "25", "50"]}
            value={limit}
            onChange={(val) => {
              setLimit(val);
              setPage(1);
            }}
            allowDeselect={false}
            w={80}
          />
        </Group>
      </Group>

      <ScrollArea>
        <Table verticalSpacing="sm" withColumnBorders withTableBorder>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th>
                <Checkbox
                  checked={allSelected}
                  indeterminate={!allSelected && selected.length > 0}
                  onChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => toggleSort(col.accessor)}
                  style={{ cursor: "pointer", textAlign: "left" }}
                >
                  <Group gap={4}>
                    <Text fw={600}>{col.label.toUpperCase()}</Text>
                    {sortConfig.key === col.accessor &&
                      (sortConfig.direction === "asc" ? (
                        <IconChevronUp size={14} />
                      ) : (
                        <IconChevronDown size={14} />
                      ))}
                  </Group>
                </th>
              ))}
              {(onEdit || onDelete) && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => {
              const isSelected = selected.includes(item[rowKey]);
              return (
                <tr
                  key={item[rowKey]}
                  className={clsx({ "bg-gray-100": isSelected })}
                  style={{ backgroundColor: isSelected ? "#f1f3f5" : undefined }}
                >
                  <td>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleOne(item[rowKey])}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.accessor}>
                      {col.accessor === "status" ? (
                        <Badge
                          color={
                            item[col.accessor] === "Active"
                              ? "green"
                              : item[col.accessor] === "Paused"
                              ? "yellow"
                              : "gray"
                          }
                        >
                          {item[col.accessor]}
                        </Badge>
                      ) : (
                        <Text size="sm">{item[col.accessor]}</Text>
                      )}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td>
                      <Flex gap="xs">
                        {onEdit && (
                          <Button
                            size="xs"
                            color="blue"
                            variant="light"
                            onClick={() => onEdit(item)}
                            leftSection={<IconEdit size={14} />}
                          >
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="xs"
                            color="red"
                            variant="light"
                            onClick={() => onDelete(item)}
                            leftSection={<IconTrash size={14} />}
                          >
                            Delete
                          </Button>
                        )}
                      </Flex>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>

      <Group justify="end" mt="md">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>
    </Paper>
  );
}
