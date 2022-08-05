import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import Asset from "~/models/asset.server";
import { authenticator } from "~/services/auth.server";
import { Button } from "@mantine/core";
import { Form } from "@remix-run/react";
import { deleteFile } from "~/utils/file-upload.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  const user = await authenticator.isAuthenticated(request);

  const file = await Asset.findById(params.id, user!.id);

  if (!file) {
    throw new Error("File not found");
  }

  if (request.method === "DELETE") {
    await deleteFile(file.path);
    await Asset.deleteById(params.id);

    return redirect("/upload");
  }

  return json({});
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  const user = await authenticator.isAuthenticated(request);

  const file = await Asset.findById(params.id, user!.id);

  if (!file) {
    throw new Error("File not found");
  }

  return json(file);
};

function UploadDetail() {
  return (
    <div>
      UploadDetail
      <Form method="delete">
        <Button type="submit">Delete</Button>
      </Form>
    </div>
  );
}

export default UploadDetail;
