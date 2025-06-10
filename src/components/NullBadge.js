// components/NullBadge.js
import { Badge } from "@mantine/core";

export default function NullBadge({ value }) {
  if (!value) {
    return (
      <Badge color="gray" variant="light">
        Data NULL
      </Badge>
    );
  }

  return <>{value}</>; // Jika ada isi, tampilkan apa adanya
}
