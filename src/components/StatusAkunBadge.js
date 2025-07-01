import { Badge } from "@mantine/core";

export default function StatusAkunBadge({ value }) {
  const normalized = String(value).toLowerCase();

  const config = {
    true: { color: "green", label: "Aktif" },
    "1": { color: "green", label: "Aktif" },
    aktif: { color: "green", label: "Aktif" },

    false: { color: "red", label: "Non-Aktif" },
    "0": { color: "red", label: "Non-Aktif" },
    "non-aktif": { color: "red", label: "Non-Aktif" },
  };

  const badge = config[normalized] || {
    color: "gray",
    label: String(value) || "Tidak diketahui",
  };

  return (
    <Badge color={badge.color} variant="light" radius="sm" size="sm">
      {badge.label}
    </Badge>
  );
}
