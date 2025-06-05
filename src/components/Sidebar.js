import { Box, NavLink, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box w={220} p="md" bg="blue.6" h="100vh" style={{ color: 'white' }}>
      <Stack gap="xs">
        <NavLink
          label="Dashboard"
          component={Link}
          href="/dashboard"
          active={pathname === '/dashboard'}
          styles={{
            root: {
              color: 'white',
              backgroundColor: pathname === '/dashboard' ? '#1c7ed6' : 'transparent',
              borderRadius: 8,
            },
          }}
        />
        <NavLink
          label="Menu"
          component={Link}
          href="/menu"
          active={pathname === '/menu'}
          styles={{
            root: {
              color:'white',
              backgroundColor: pathname === '/menu' ? '#1c7ed6' : 'transparent',
              borderRadius: 8,
            },
          }}
        />
        <NavLink
          label="User"
          component={Link}
          href="/users"
          active={pathname === '/users'}
          styles={{
            root: {
              color:'white',
              backgroundColor: pathname === '/users' ? '#1c7ed6' : 'transparent',
              borderRadius: 8,
            },
          }}
        />
        <NavLink
          label="User Akses"
          component={Link}
          href="/usersakses"
          active={pathname === '/usersakses'}
          styles={{
            root: {
              color:'white',
              backgroundColor: pathname === '/usersakses' ? '#1c7ed6' : 'transparent',
              borderRadius: 8,
            },
          }}
        />
        <NavLink
          label="Aplikasi"
          component={Link}
          href="/apps"
          active={pathname === '/apps'}
          styles={{
            root: {
              color:'white',
              backgroundColor: pathname === '/apps' ? '#1c7ed6' : 'transparent',
              borderRadius: 8,
            },
          }}
        />
        <NavLink
          label="Hak Akses"
          component={Link}
          href="/hak-akses"
          active={pathname === '/hak-akses'}
          styles={{
            root: {
              color:'white',
              backgroundColor: pathname === '/hak-akses' ? '#1c7ed6' : 'transparent',
              borderRadius: 8,
            },
          }}
        />
      </Stack>
    </Box>
  );
}
