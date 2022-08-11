import invariant from "tiny-invariant";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  AspectRatio,
  Badge,
  Group,
  Stack,
  Title,
  Text,
  Code,
} from "@mantine/core";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import Streaming from "~/models/streaming.server";
import { isAuthenticated } from "~/services/auth.server";
import { stopStreaming } from "~/queues/streaming.server";
import type { StreamingFindById } from "~/models/streaming.server";
import { loop } from "~/constants";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.name ?? "Streaming",
    content: "Streaming",
    path: "/streaming",
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  await isAuthenticated(request);

  if (request.method === "DELETE") {
    stopStreaming(params.id);

    const streaming = await Streaming.deleteById(params.id);
    return json(streaming);
  }

  return json({});
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  await isAuthenticated(request);

  const streaming = await Streaming.findById(params.id);

  // const jobs = await streamingQueue.getJobs();
  // console.log(jobs);

  return json(streaming);
};

function StreamingPage() {
  const data = useLoaderData<StreamingFindById>();

  return (
    <Stack>
      <Group align="center">
        <Title order={3}>{data?.name}</Title>
        <Badge color={data?.status ? "" : "red"}>{data?.status}</Badge>
      </Group>
      <Group align="center">
        <Text>Loop</Text>
        <Code>{loop(data?.loop.toString() ?? "0")?.label}</Code>
      </Group>
      <div style={{ width: 250 }}>
        <AspectRatio ratio={16 / 9}>
          <video src={`/uploads/${data?.asset.path}`} controls />
        </AspectRatio>
      </div>
    </Stack>
  );
}

export default StreamingPage;
