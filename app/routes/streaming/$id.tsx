import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { isAuthenticated } from "~/services/auth.server";
import Streaming from "~/models/streaming.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  await isAuthenticated(request);

  if (request.method === "DELETE") {
    if (global.__runningLives && global.__runningLives[params.id]) {
      global.__runningLives[params.id].kill("SIGKILL");
      delete global.__runningLives[params.id];
    }

    const streaming = await Streaming.deleteById(params.id);
    return json(streaming);
  }

  return json({});
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");

  return {};
};

function StreamingPage() {
  return <div>Streaming</div>;
}

export default StreamingPage;
