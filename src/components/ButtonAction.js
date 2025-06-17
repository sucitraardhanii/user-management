"use client";

import { Button, Flex } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ButtonAction({ editUrl, onDelete }) {
  const router = useRouter();
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleEdit = async () => {
    setLoadingEdit(true);
    router.push(editUrl);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await onDelete(); // fungsi dari parent
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Flex gap="xs" wrap="nowrap">
      <Button
        size="xs"
        variant="light"
        color="blue"
        component={Link}
        href={editUrl}
        onClick={handleEdit}
        loading={loadingEdit}
        leftSection={<IconEdit size={14} />}
      >
        Edit
      </Button>
      <Button
        size="xs"
        variant="light"
        color="red"
        onClick={handleDelete}
        loading={loadingDelete}
        leftSection={<IconTrash size={14} />}
      >
        Delete
      </Button>
    </Flex>
  );
}
