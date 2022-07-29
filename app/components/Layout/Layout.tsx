import type { FC } from "react";
import { AppShell, Title } from "@mantine/core";
import { MyNavbar } from "./MyNavbar";

type Props = {
  title?: string;
};

export const Layout: FC<Props> = ({ title, children }) => {
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
      <Title pb="lg">{title}</Title>
      {children}
    </AppShell>
  );
};
