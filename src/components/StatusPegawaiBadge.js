import { Badge } from "@mantine/core";

export default function StatusPegawaiBadge({ value }) {
  const normalized = String(value).toLowerCase();

  const config = {
    "1": { color: "blue", label: "Organik" },
    "2": { color: "orange", label: "Non Organik" },
    "3": { color: "yellow", label: "Bypass" },
    "4": { color: "red", label: "External" },

    organik: { color: "blue", label: "Organik" },
    "non organik": { color: "orange", label: "Non Organik" },
    bypass: { color: "yellow", label: "Bypass" },
    external: { color: "red", label: "External" },
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
