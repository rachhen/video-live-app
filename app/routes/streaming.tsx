import type { MetaFunction } from "@remix-run/node";
import { Paper, Notification } from "@mantine/core";
import { Outlet, useNavigate, useSearchParams } from "@remix-run/react";
import { IconCheck } from "@tabler/icons";

import { Layout } from "~/components/Layout";

export const meta: MetaFunction = () => ({
  title: "Streaming",
  content: "Streaming",
  path: "/streaming",
});

function Streaming() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <Layout title="Streaming">
      {searchParams.get("created") && (
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title="Success!"
          onClose={() => navigate("/streaming")}
        >
          Streaming has been created.
        </Notification>
      )}
      <Paper withBorder p="md" mt="md">
        <Outlet />
      </Paper>
    </Layout>
  );
}

export default Streaming;
