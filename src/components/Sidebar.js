"use client";

import { Box, NavLink, Stack, Loader, Collapse } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingPath, setLoadingPath] = useState(null);
  const [openedDropdown, setOpenedDropdown] = useState(null);

  const handleClick = (href) => {
    if (href !== pathname) {
      setLoadingPath(href);
      router.push(href);
    }
  };

  const handleToggle = (label) => {
    setOpenedDropdown((prev) => (prev === label ? null : label));
  };

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: 'Aplikasi', href: '/apps' },
    { label: 'Hak Akses', href: '/hak-akses' },
    {
      label: "Menu",
      children: [
        { label: "Jabatan", href: "/menu/jabatan" },
        { label: "Kantor", href: "/menu/kantor" },
        { label: "Menu", href: "/menu/menu" },
      ],
    },
    {
      label: 'Registrasi',
      children: [
        { label: 'Registrasi User Baru', href: '/registrasi-user' },
        { label: 'Registrasi Aplikasi Baru', href: '/users/external' },
      ],
    },
    {
      label: "User",
      href:'/user',
      children: [
        { label: "User Internal", href: "/user/internal" },
        { label: "User Eksternal", href: "/user/external" },
      ],
    },
    { label: 'User Akses', href: '/user-akses' },
    { label: 'Aplikasi', href: '/apps' },
    { label: 'Hak Akses', href: '/hak-akses' },
  ];

  useEffect(() => {
    setLoadingPath(null);
  }, [pathname]);

  return (
    <Box w={220} p="md" bg="blue.6" h="100vh" style={{ color: "white" }}>
      <Stack gap="xs">
        {links.map((link) =>
          link.children ? (
            <Box key={link.label}>
              <NavLink
                label={link.label}
                onClick={() => handleToggle(link.label)}
                rightSection={
                  openedDropdown === link.label ? (
                    <IconChevronUp size={16} />
                  ) : (
                    <IconChevronDown size={16} />
                  )
                }
                styles={{
                  root: {
                    color: "white",
                    backgroundColor:
                      openedDropdown === link.label ? "#1c7ed6" : "transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                  },
                }}
              />
              <Collapse in={openedDropdown === link.label}>
                {link.children.map((child) => (
                  <NavLink
                    key={child.href}
                    label={child.label}
                    onClick={() => handleClick(child.href)}
                    active={pathname === child.href}
                    pl="lg"
                    rightSection={
                      loadingPath === child.href ? (
                        <Loader size="xs" color="white" />
                      ) : null
                    }
                    styles={{
                      root: {
                        color: "white",
                        backgroundColor:
                          pathname === child.href ? "#1c7ed6" : "transparent",
                        borderRadius: 8,
                        cursor: "pointer",
                      },
                    }}
                  />
                ))}
              </Collapse>
            </Box>
          ) : (
            <NavLink
              key={link.href}
              label={link.label}
              onClick={() => handleClick(link.href)}
              active={pathname === link.href}
              rightSection={
                loadingPath === link.href ? (
                  <Loader size="xs" color="white" />
                ) : null
              }
              styles={{
                root: {
                  color: "white",
                  backgroundColor:
                    pathname === link.href ? "#1c7ed6" : "transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                },
              }}
            />
          )
        )}
      </Stack>
    </Box>
  );
}
