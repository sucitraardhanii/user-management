'use client';

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import AppShell from '@/components/AppShell';

export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppShell>{children}</AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
