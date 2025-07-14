"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card, Flex, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const paths = segments.map((_, i) => "/" + segments.slice(0, i + 1).join("/"));

  return (
    <Card withBorder radius="md" p="sm" mb="md" shadow="xs">
      <Flex align="center" gap="xs" wrap="wrap">
        {segments.map((segment, i) => (
          <Flex key={i} align="center" gap={4}>
            <Link href={paths[i]} style={{ textDecoration: "none" }}>
              <Text
                size="sm"
                fw={500}
                color="#2E4070A"
                style={{ textTransform: "capitalize" }}
              >
                {segment.replace(/-/g, " ")}
              </Text>
            </Link>
            {i < segments.length - 1 && <IconChevronRight size={14} stroke={1.5} />}
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}
