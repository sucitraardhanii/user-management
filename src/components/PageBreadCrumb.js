"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs, Anchor } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

// Mapping manual
const labelMapping = {
  create: "Tambah",
  edit: "Edit",
  daftar: "Daftar",
};

const capitalize = (text) =>
  text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function PageBreadCrumb() {
  const pathname = usePathname(); // e.g. /user-akses
  const segments = pathname.split("/").filter(Boolean); // [user-akses]

  const items = segments
    .filter((seg) => isNaN(seg)) // sembunyikan angka
    .map((seg, index, arr) => {
      const href = "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/");
      const isLast = index === arr.length - 1;
      const label = labelMapping[seg] || capitalize(seg);

      return (
        <Anchor
          component={Link}
          href={href}
          key={href}
          size="sm"
          style={{
            pointerEvents: isLast ? "none" : "auto",
            color: isLast ? "gray" : undefined,
          }}
        >
          {label}
        </Anchor>
      );
    });

  // Tambahkan "Daftar" jika hanya 1 segment (misal: /user-akses)
  if (segments.length === 1) {
    items.push(
      <Anchor key="daftar" size="sm" style={{ pointerEvents: "none", color: "gray" }}>
        Daftar
      </Anchor>
    );
  }

  return (
    <Breadcrumbs separator={<IconChevronRight size="0.9rem" />} mb="xs">
      {items}
    </Breadcrumbs>
  );
}
