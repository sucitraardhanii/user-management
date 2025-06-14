import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'User Management',
  description: 'Dashboard aplikasi user management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
