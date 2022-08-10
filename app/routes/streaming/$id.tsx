import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { isAuthenticated } from "~/services/auth.server";
import Streaming from "~/models/streaming.server";
import { streamingQueue } from "~/queues/streaming.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  await isAuthenticated(request);

  if (request.method === "DELETE") {
    const streaming = await Streaming.deleteById(params.id);
    return json(streaming);
  }

  return json({});
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");

  const qq = await streamingQueue.getJob(params.id);

  console.log("state", await qq?.remove());

  return {};
};

function StreamingPage() {
  return <div>Streaming</div>;
}

export default StreamingPage;
