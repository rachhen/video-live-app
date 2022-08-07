import invariant from "tiny-invariant";
import { AspectRatio, Button, Stack } from "@mantine/core";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import Asset from "~/models/asset.server";
import type { FindOneAsset } from "~/models/asset.server";
import { isAuthenticated } from "~/services/auth.server";
import { deleteFile } from "~/utils/file-upload.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  const user = await isAuthenticated(request);
  const url = new URL(request.url);

  const file = await Asset.findById(params.id, user!.id);

  if (!file) {
    throw new Error("File not found");
  }

  if (request.method === "DELETE") {
    await deleteFile(file.path);
    await Asset.deleteById(params.id);

    if (url.searchParams.get("page")) {
      return redirect(`/upload?page=${url.searchParams.get("page")}`);
    }

    return redirect("/upload");
  }

  return json({});
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "id is required");
  const user = await isAuthenticated(request);

  const file = await Asset.findById(params.id, user!.id);

  if (!file) {
    throw new Error("File not found");
  }

  return json(file);
};

function UploadDetail() {
  const asset = useLoaderData<FindOneAsset>();
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();

  const action = searchParams.get("page")
    ? `/upload/${asset?.id}?page=${searchParams.get("page")}`
    : `/upload/${asset?.id}`;

  return (
    <Stack spacing="lg">
      <AspectRatio ratio={16 / 9}>
        <video src={`/uploads/${asset?.path}`} controls />
      </AspectRatio>

      <div>
        <Button
          type="submit"
          color="red"
          onClick={() => {
            if (confirm("Are you sure you want to delete this video?")) {
              fetcher.submit({}, { action, method: "delete" });
            }
          }}
        >
          Delete
        </Button>
      </div>
    </Stack>
  );
}

export default UploadDetail;
