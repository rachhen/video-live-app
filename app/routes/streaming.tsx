import type { MetaFunction } from "@remix-run/node";
import { Layout } from "~/components";

export const meta: MetaFunction = () => ({
  title: "Streaming",
  content: "Streaming",
  path: "/streaming",
});

function Streaming() {
  return (
    <Layout title="Streaming">
      <h1>Streaming</h1>
    </Layout>
  );
}

export default Streaming;
