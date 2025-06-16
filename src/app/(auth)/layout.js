import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function AuthLayout({ children }) {
  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications position="top-center" />
        <>{children}</>
      </MantineProvider>
    </>
  );
}
