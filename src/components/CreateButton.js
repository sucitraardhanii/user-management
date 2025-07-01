// components/CreateButton.jsx
"use client";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateButton({ entity, label, onClick, useModal = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (useModal && onClick) {
      onClick(); // buka modal
    } else {
      setLoading(true);
      setTimeout(() => {
        router.push(`/${entity}/create`);
      }, 500);
    }
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
      Buat {label || entity.replace("-", " ")}
    </Button>
  );
}

