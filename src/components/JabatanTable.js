"use client";

import { useEffect, useState } from "react";
import { getJabatan } from "@/api/jabatan";
import { Table, Button, Badge } from "@mantine/core";

export default function JabatanTable({ onEdit, refreshKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getJabatan();
      setData(res);
    };

    fetchData();
  }, [refreshKey]);

  return (
    <Table highlightOnHover withBorder>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama Jabatan</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.idjabatan}>
            <td>{item.code_jabatan}</td>
            <td>{item.namajabatan}</td>
            <td>
              <Badge color={item.status === 1 ? "green" : "red"} variant="light">
                {item.status === 1 ? "Aktif" : "Nonaktif"}
              </Badge>
            </td>
            <td>
              <Button size="xs" onClick={() => onEdit(item)}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
