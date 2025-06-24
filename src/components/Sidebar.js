"use client";

import { Box, NavLink, Stack, Loader, Collapse } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { isSuperAdmin } from "@/api/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingPath, setLoadingPath] = useState(null);
  const [openedDropdown, setOpenedDropdown] = useState(null);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    setAdminMode(isSuperAdmin());
    setLoadingPath(null);
  }, [pathname]);

  const handleClick = (href) => {
    if (href !== pathname) {
      setLoadingPath(href);
      router.push(href);
    }
  };

  const handleToggle = (label) => {
    setOpenedDropdown((prev) => (prev === label ? null : label));
  };

  const baseLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "User Akses", href: "/user-akses" },
    { label: "Hak Akses", href: "/hak-akses" },
    {
          label: "Regis User External",
          href: "/user/external",
    },
    {
          label: "Regis User Internal",
          href: "/user/internal",
    },
  ];

  const adminLinks = adminMode
    ? [
        { label: "Aplikasi", href: "/apps" },
        {
          label: "User",
          href: "/user",
        },
        {
            label: "Menu",
            children: [
                  { label: "Jabatan", href: "/menu/jabatan" },
                  { label: "Kantor", href: "/menu/kantor" },
                  { label: "Menu", href: "/menu/menu" },
                ],
          },
      ]
    : [];

  const links = [...baseLinks, ...adminLinks];

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
