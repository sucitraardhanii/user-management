// file ini ditulis dengan react (next.js client component) dan menggunakan mantine UI 


"use client"; // dibutuhkan untuk next.js app router

import { Box, Burger, Group, Flex, Text, Avatar, Menu, UnstyledButton } from "@mantine/core";
import { IconUser, IconChevronDown, IconLogout, IconSettings } from "@tabler/icons-react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header({ sidebarOpened, onToggleSidebar }) {
// sidebarOpened: state boolean untuk sidebar (apakah terbuka atau tidak)
// onToggleSidebar: fungsi untuk membuka/tutup sidebar saat tombol burger di klik
const router = useRouter();

const handleLogout = () => {
  logout();            // hapus token dari localStorage
  router.replace("/login"); // redirect ke halaman login
};
  return (
    <Box
      h={60} //tinggi header 60px
      px="md" //padding horizontal medium
      py="xs" // padding vertikal kecil
      bg="white" // background putih
      c="black" style={{ borderBottom: "1px solid #eee" }} // garis abu di bawah header
    >
      <Flex h="100%" align="center" justify="space-between">
        {/* Kiri */}
        <Group spacing="sm">
          <Burger
            opened={sidebarOpened}
            onClick={onToggleSidebar}
            size="sm"
            color={sidebarOpened ? "black" : "black"}
          />
          <Text fw={600} size="lg">
            User Management
          </Text>
        </Group>

        {/* Kanan */}
        <Menu withArrow position="bottom-end" shadow="md">
          <Menu.Target> 
            <UnstyledButton>
              <Group spacing={5}>
                <Avatar radius="xl" color="blue">
                  <IconUser size={20} />
                </Avatar>
                <IconChevronDown size={18} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item icon={<IconUser size={18} />}>My Profile</Menu.Item>
            <Menu.Item icon={<IconSettings size={18} />}>Settings</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" icon={<IconLogout size={18} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Box>
  );
}

// menu.target : tombol yang memicu dropdown(saat klik avatar)
// avatar : bulatan berwaran biru dengan icon user
// iconchevronbottom : panah ke bawah
// menu.divider : garis pemisah