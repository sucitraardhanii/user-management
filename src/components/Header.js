"use client";

import { Box, Burger, Group, Flex } from "@mantine/core";

export default function Header({ sidebarOpened, onToggleSidebar }) {
  return (
    <Box
      h={30}
      px="xs"
      py={30}
      bg="white"
      c="black"
    >
      <Flex h="100%" align="center" justify="space-between">
        <Group>
          <Burger
            opened={sidebarOpened}
            onClick={onToggleSidebar}
            size="sm"
            color={sidebarOpened ? "black" : "black"}
          />
        </Group>
      </Flex>
    </Box>
  );
}
