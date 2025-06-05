import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export default function AuthLayout({ children }) {
  return (
 <>
 <MantineProvider withGlobalStyles withNormalizeCSS>
          {children}
        </MantineProvider>
 </>
        
  );
}
