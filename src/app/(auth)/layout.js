import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export default function AuthLayout({ children }) {
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
