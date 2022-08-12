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
  Button,
} from "@mantine/core";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import Streaming from "~/models/streaming.server";
import { isAuthenticated } from "~/services/auth.server";
import { stopStreaming, streamingQueue } from "~/queues/streaming.server";
import type { StreamingFindById } from "~/models/streaming.server";
import { loop } from "~/constants";
import { dateFormat } from "~/utils/date-format";

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

    await Streaming.deleteById(params.id);
    return redirect("/streaming");
  }

  return json({});
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  await isAuthenticated(request);

  const streaming = await Streaming.findById(params.id);

  const jobs = await streamingQueue.getJobs();
  console.log(jobs);

  return json(streaming);
};

function StreamingPage() {
  const data = useLoaderData<StreamingFindById>();
  const fetcher = useFetcher();

  return (
    <Stack>
      <Group align="center">
        <Title order={3}>{data?.name}</Title>
        <Badge color={data?.status ? "" : "red"}>{data?.status}</Badge>
      </Group>
      <Group align="center">
        <Text size="xs">Created At</Text>
        <Code>{dateFormat(data?.createdAt!)}</Code>
      </Group>
      <Group align="center">
        <Text size="xs">Updated At</Text>
        <Code>{dateFormat(data?.updatedAt!)}</Code>
      </Group>
      <Group align="center">
        <Text size="xs">Resolution</Text>
        <Code>{data?.resolution}</Code>
      </Group>
      <Group align="center">
        <Text size="xs">Loop</Text>
        <Code>{loop(data?.loop.toString() ?? "0")?.label}</Code>
      </Group>
      <div style={{ width: 250 }}>
        <AspectRatio ratio={16 / 9}>
          <video src={`/uploads/${data?.asset.path}`} controls />
        </AspectRatio>
      </div>
      <div>
        <Button
          color="red"
          onClick={() => {
            if (confirm("Are you sure?")) {
              fetcher.submit(
                {},
                {
                  action: `/streaming/${data?.id}`,
                  method: "delete",
                }
              );
            }
          }}
        >
          Delete
        </Button>
      </div>
    </Stack>
  );
}

export default StreamingPage;
