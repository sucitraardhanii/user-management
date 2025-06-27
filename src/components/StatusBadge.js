import { Badge } from "@mantine/core";

export default function StatusBadge({ value }) {
  const normalized = String(value).toLowerCase();

  const config = {
    aktif: { color: "green", label: "Aktif" },
    "1": { color: "green", label: "Aktif" },
    "true": { color: "green", label: "Aktif" },

    "non-aktif": { color: "red", label: "Non-Aktif" },
    "0": { color: "red", label: "Non-Aktif" },
    "false": { color: "red", label: "Non-Aktif" },

    organik: { color: "blue", label: "Organik" },
    "non organik": { color: "yellow", label: "Non Organik" },
  };

  const badge = config[normalized] || {
    color: "gray",
    label: value || "Tidak diketahui",
  };

  return (
    <Badge color={badge.color} variant="light" radius="sm" size="sm">
      {badge.label}
    </Badge>
  );
}
