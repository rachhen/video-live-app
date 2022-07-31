/* eslint-disable jsx-a11y/anchor-is-valid */
import { createStyles, Navbar, Group, Code } from "@mantine/core";
import {
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconLogout,
  IconCloudUpload,
  IconBroadcast,
} from "@tabler/icons";
import { MantineLogo } from "@mantine/ds";
import { NavLink, useFetcher } from "@remix-run/react";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: "/upload", label: "Upload", icon: IconCloudUpload },
  { link: "/streaming", label: "Streaming", icon: IconBroadcast },
  { link: "/Security", label: "Security", icon: IconFingerprint },
  { link: "/ssh", label: "SSH Keys", icon: IconKey },
  { link: "/databases", label: "Databases", icon: IconDatabaseImport },
  { link: "/authentication", label: "Authentication", icon: Icon2fa },
  { link: "/settings", label: "Other Settings", icon: IconSettings },
];

export function MyNavbar() {
  const { classes, cx } = useStyles();
  const fetcher = useFetcher();

  const links = data.map((item) => (
    <NavLink
      to={item.link}
      key={item.label}
      className={({ isActive }) => {
        return cx(classes.link, { [classes.linkActive]: isActive });
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <MantineLogo size={28} />
          <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
              fetcher.submit({}, { action: "/logout", method: "post" });
            }
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
