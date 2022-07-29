import type { FC } from "react";
import { AppShell } from "@mantine/core";
import { MyNavbar } from "./MyNavbar";

export const Layout: FC = ({ children }) => {
  return (
    <AppShell
      padding="md"
      navbar={<MyNavbar />}
      // header={
      //   <Header height={60} p="xs">
      //     {/* Header content */}
      //   </Header>
      // }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};
