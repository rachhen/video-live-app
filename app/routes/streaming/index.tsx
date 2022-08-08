import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Text } from "@mantine/core";

import type { StreamingFindAll } from "~/models/streaming.server";
import Streaming from "~/models/streaming.server";
import { isAuthenticated } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request);

  const streamings = await Streaming.findAll(user.id);

  return json(streamings);
};

function StreamingPage() {
  const data = useLoaderData<StreamingFindAll>();
  return (
    <div>
      <Link to="new">New Streaming</Link>

      {data.map((item) => (
        <Text key={item.id}>{item.rtmps}</Text>
      ))}
    </div>
  );
}

export default StreamingPage;
