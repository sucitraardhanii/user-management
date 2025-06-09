// components/StatusBadge.js
import { Badge } from "@mantine/core";

export default function StatusBadge({ value }) {
  const isAktif =
    value === "aktif" || value === 1 || value === "1" || value === true;

  return (
    <Badge
      color={isAktif ? "green" : "red"}
      variant="light"
      radius="sm"
      size="sm"
    >
      {isAktif ? "Aktif" : "Non-Aktif"}
    </Badge>
  );
}
