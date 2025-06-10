"use client";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateButton({ entity }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/${entity}/create`);
    }, 500); // biar keliatan loading-nya, delay sedikit
  };

  return (
    <Button
      leftSection={<IconPlus size={16} />}
      loading={loading}
      onClick={handleClick}
      variant="filled"
      color="blue"
      radius="md"
    >
      Buat {entity.replace("-", " ")}
    </Button>
  );
}
