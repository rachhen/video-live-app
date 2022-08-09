import invariant from "tiny-invariant";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { isAuthenticated } from "~/services/auth.server";
import Streaming from "~/models/streaming.server";

export const action: ActionFunction = async ({ request, params }) => {
  await isAuthenticated(request);

  if (request.method === "DELETE") {
    invariant(params.id, "id is required");
    const streaming = await Streaming.deleteById(params.id);
    return json(streaming);
  }

  return json({});
};
