'use client';

import { Box, NavLink, Stack, Loader } from '@mantine/core';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingPath, setLoadingPath] = useState(null);

  const links = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Menu', href: '/menu' },
    { label: 'User', href: '/users' },
    { label: 'User Akses', href: '/user-akses' },
    { label: 'Aplikasi', href: '/apps' },
    { label: 'Hak Akses', href: '/hak-akses' },
  ];

  const handleClick = (href) => {
    setLoadingPath(href);
    router.push(href);
  };

  return (
    <Box w={220} p="md" bg="blue.6" h="100vh" style={{ color: 'white' }}>
      <Stack gap="xs">
        {links.map((link) => (
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
                color: 'white',
                backgroundColor: pathname === link.href ? '#1c7ed6' : 'transparent',
                borderRadius: 8,
                cursor: 'pointer',
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
