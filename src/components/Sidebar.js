"use client";

import {
  Box,
  NavLink,
  Stack,
  Loader,
  Collapse,
  Image,
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
        { label: "Jabatan", href: "/referensi/jabatan" },
        { label: "Kantor", href: "/referensi/kantor" },
        { label: "Menu", href: "/referensi/menu" },
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
                backgroundColor:
                  openedDropdown === link.label ? "#1C2D5A" : "transparent",
                color: openedDropdown === link.label ? "#ffffff" : "#1C2D5A",
                fontWeight: 600,
                borderRadius: 8,
                transition: "all 0.2s",
              },
              label: {
                fontSize: "14px",
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

  const renderSingleLink = (link, isChild = false) => {
    const active = pathname === link.href;
    return (
      <NavLink
        key={link.href}
        label={link.label}
        onClick={() => handleClick(link.href)}
        active={active}
        pl={isChild ? "lg" : undefined}
        rightSection={
          loadingPath === link.href ? <Loader size="xs" color="gray" /> : null
        }
        styles={{
          root: {
            backgroundColor: active ? "#1C2D5A" : "transparent",
            color: active ? "#ffffff" : "#1C2D5A",
            fontWeight: active ? 600 : 500,
            borderRadius: 8,
            padding: "8px 12px",
            transition: "all 0.2s",
          },
          label: {
            fontSize: "14px",
          },
        }}
      />
    );
  };

  return (
    <Box w={220} p="md" bg="#F7F7F7" h="100vh">
      <Box mb="lg" style={{textAlign: "center"}}>
        <Image  src="/img/posind-logo.png" alt="Logo" style={{maxWidth: "30%", maxHeight: "50", margin: "0 auto 8px auto",}}/>
      </Box>
      <Stack gap="xs">{links.map(renderLink)}</Stack>
    </Box>
  );
}
