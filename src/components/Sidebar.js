"use client";

import {
  Box,
  NavLink,
  Stack,
  Loader,
  Collapse,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

  const adminLinks = [
    { label: "Aplikasi", href: "/apps" },
    { label: "User Akses", href: "/user-akses" },
    { label: "Hak Akses", href: "/hak-akses" },
    {
      label: "User",
      href: "/user",
    },
    {
      label: "Referensi",
      children: [
        { label: "Jabatan", href: "/jabatan" },
        { label: "Kantor", href: "referensi/kantor" },
        { label: "Menu", href: "referensi/menu/menu" },
      ],
    },
  ];

  const nonAdminLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "User Akses", href: "/user-akses" },
    { label: "Hak Akses", href: "/hak-akses" },
    { label: "User", href: "/user/external" },
  ];

  const links = adminMode ? adminLinks : nonAdminLinks;

  const renderLink = (link) => {
    if (link.children) {
      return (
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
            {link.children.map((child) => renderSingleLink(child, true))}
          </Collapse>
        </Box>
      );
    }
    return renderSingleLink(link);
  };

  const renderSingleLink = (link, isChild = false) => (
    <NavLink
      key={link.href}
      label={link.label}
      onClick={() => handleClick(link.href)}
      active={pathname === link.href}
      pl={isChild ? "lg" : undefined}
      rightSection={
        loadingPath === link.href ? <Loader size="xs" color="white" /> : null
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
  );

  return (
    <Box w={220} p="md" bg="blue.6" h="100vh" style={{ color: "white" }}>
      <Stack gap="xs">{links.map(renderLink)}</Stack>
    </Box>
  );
}
