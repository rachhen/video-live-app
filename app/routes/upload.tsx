import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  SimpleGrid,
  Modal,
  Pagination,
  Stack,
  AspectRatio,
  Paper,
  Text,
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
  useSearchParams,
} from "@remix-run/react";

import Asset from "~/models/asset.server";
import type { FindAllAsset } from "~/models/asset.server";
import { Layout } from "~/components/Layout";
import { UploadDropzone } from "~/features/Upload";
import { fileUpload } from "~/utils/file-upload.server";
import { uploadValidator } from "~/schemas/upload";
import { isAuthenticated } from "~/services/auth.server";
import { pagiatedValidator } from "~/schemas/paginated";

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
  const url = new URL(request.url);
  const user = await isAuthenticated(request);
  const result = await pagiatedValidator.validate(url.searchParams);

  if (result.error) return validationError(result.error);

  const files = await Asset.findAll(user.id, result.data);

  return json(files);
};

function Upload() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { data: files, total } = useLoaderData<FindAllAsset>();

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

  const isOpen = !!params.id;
  const isSubmiting = fetcher.state === "submitting";
  const page = +(searchParams.get("page") ?? "1");

  const linkTo = (id: string) =>
    searchParams.get("page")
      ? `/upload/${id}?page=${searchParams.get("page")}`
      : `/upload/${id}`;

  return (
    <Layout title="Media Library">
      <UploadDropzone onDrop={onDrop} loading={isSubmiting} />
      <Stack>
        <SimpleGrid cols={5} mt="lg">
          {files.map((item) => (
            <Paper
              withBorder
              key={item.id}
              component={Link}
              to={linkTo(item.id)}
            >
              <AspectRatio ratio={16 / 9}>
                <video src={`/uploads/${item.path}`} />
              </AspectRatio>
              <Text p="xs" size="sm">
                {item.name}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
        <Pagination
          total={total}
          page={page}
          onChange={(page) => navigate(`/upload?page=${page}`)}
        />
      </Stack>
      <Modal
        size="xl"
        centered
        opened={isOpen}
        onClose={() => {
          navigate(-1);
        }}
        title="Video Preview"
      >
        <Outlet />
      </Modal>
    </Layout>
  );
}

export default Upload;
