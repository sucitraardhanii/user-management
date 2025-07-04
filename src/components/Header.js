// file ini ditulis dengan react (next.js client component) dan menggunakan mantine UI

"use client"; // dibutuhkan untuk next.js app router

import {
  Box,
  Burger,
  Group,
  Flex,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import {
  IconUser,
  IconChevronDown,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { logout } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusPegawaiBadge from "./StatusPegawaiBadge";

export default function Header({ sidebarOpened, onToggleSidebar }) {
  // sidebarOpened: state boolean untuk sidebar (apakah terbuka atau tidak)
  // onToggleSidebar: fungsi untuk membuka/tutup sidebar saat tombol burger di klik
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const itemStr = localStorage.getItem("auth_token");
    if (!itemStr) return;

    try {
      const item = JSON.parse(itemStr);
      const nippos = item?.nippos;
      const token = item?.token;

      if (!nippos) return;

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nippos }),
      })
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            const raw = await res.text();
            console.error("❌ Bukan JSON:", raw);
            return;
          }

          const data = await res.json();

          if (data.data && data.data.length > 0) {
            setUserData(data.data[0]);
          } else {
            setUserData({
              nama: "Tidak Ditemukan",
              jabatan: "Tidak ditemukan",
              nopend: "",
              status_pegawai: "",
            });
          }
        })
        .catch((err) => {
          console.error("❌ Gagal fetch user:", err);
        });
    } catch (err) {
      console.error("Gagal parsing token:", err);
    }
  }, []);

  const handleLogout = () => {
    logout(); // hapus token dari localStorage
    router.replace("/login"); // redirect ke halaman login
  };

  return (
    <Box
      h={60} //tinggi header 60px
      px="md" //padding horizontal medium
      py="xs" // padding vertikal kecil
      bg="white" // background putih
      c="black"
      style={{ borderBottom: "1px solid #eee" }} // garis abu di bawah header
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
            <Box px="sm" py="xs">
              <Text fw={700}>{userData?.nama || "Tidak Ditemukan"}</Text>
              <Text size="sm" c="dimmed">
                {userData?.jabatan || "Tidak ditemukan"}
              </Text>
              <Text size="xs" c="dimmed">
                Nopend: {userData?.nopend}
              </Text>
              <Group gap="xs">
                <Text size="xs" c="dimmed">
                  Status:
                </Text>
                <StatusPegawaiBadge value={userData?.status_pegawai} />
              </Group>
            </Box>
            <Menu.Divider />
            <Menu.Item
              color="red"
              icon={<IconLogout size={18} />}
              onClick={handleLogout}
            >
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
