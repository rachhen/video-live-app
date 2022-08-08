import type { MetaFunction } from "@remix-run/node";
import { Paper } from "@mantine/core";
import { Layout } from "~/components";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "Streaming",
  content: "Streaming",
  path: "/streaming",
});

function Streaming() {
  return (
    <Layout title="Streaming">
      <Paper withBorder p="md">
        <Outlet />
      </Paper>
    </Layout>
  );
}

export default Streaming;
