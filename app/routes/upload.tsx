import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  SimpleGrid,
  Modal,
  Pagination,
  Stack,
  AspectRatio,
} from "@mantine/core";
import type {
  ActionFunction,
  MetaFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";

import type { FindAllAsset } from "~/models/asset.server";
import { Layout } from "~/components/Layout";
import { UploadDropzone } from "~/features/Upload";
import { fileUpload } from "~/utils/file-upload.server";
import { uploadValidator } from "~/schemas/upload";
import { isAuthenticated } from "~/services/auth.server";
import Asset from "~/models/asset.server";

export const meta: MetaFunction = () => {
  return {
    title: "Media Library",
    description: "Upload files to the media library",
    path: "/upload",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await isAuthenticated(request.clone());
  const formData = await fileUpload(request);

  const result = await uploadValidator.validate(formData);

  if (result.error) return validationError(result.error);

  const file = await Asset.create({
    name: result.data.file.name,
    type: result.data.file.type,
    path: result.data.file.name,
    size: result.data.file.size,
    user: { connect: { id: user.id } },
  });

  return json(file);
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request);

  const files = await Asset.findAll(user.id);

  return json(files);
};

function Upload() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const files = useLoaderData<FindAllAsset>();
  const params = useParams();

  const onDrop = (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("file", file);
    });

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  const isSubmiting = fetcher.state === "submitting";
  const isOpen = !!params.id;

  return (
    <Layout title="Media Library">
      <UploadDropzone onDrop={onDrop} loading={isSubmiting} />
      <Stack>
        <SimpleGrid cols={5} mt="lg">
          {files.map((item) => (
            <Link key={item.id} to={`/upload/${item.id}`}>
              <AspectRatio ratio={16 / 9}>
                <video src={`/uploads/${item.path}`} />
              </AspectRatio>
            </Link>
          ))}
        </SimpleGrid>
        <Pagination page={1} total={10} />
      </Stack>
      <Modal
        size="xl"
        centered
        opened={isOpen}
        onClose={() => {
          navigate("/upload");
        }}
        title="Introduce yourself!"
      >
        <Outlet />
      </Modal>
    </Layout>
  );
}

export default Upload;
