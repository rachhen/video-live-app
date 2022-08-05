import { useState } from "react";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { SimpleGrid, Modal, Pagination, Stack } from "@mantine/core";
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
} from "@remix-run/react";

import { Layout } from "~/components/Layout";
import { UploadDropzone } from "~/features/Upload";
import { fileUpload } from "~/utils/file-upload.server";
import { uploadValidator } from "~/schemas/upload";
import { prisma } from "~/services/db.server";
import { authenticator } from "~/services/auth.server";
import type { FileUpload } from "~/models/fileUpload.server";

export const meta: MetaFunction = () => {
  return {
    title: "Media Library",
    description: "Upload files to the media library",
    path: "/upload",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request.clone());
  const formData = await fileUpload(request);

  const result = await uploadValidator.validate(formData);

  if (result.error) return validationError(result.error);

  const file = await prisma.fileUpload.create({
    data: {
      name: result.data.file.name,
      type: result.data.file.type,
      path: result.data.file.name,
      size: result.data.file.size,
      userId: user!.id,
    },
  });

  return json(file);
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request);

  const files = await prisma.fileUpload.findMany();

  return json(files);
};

function Upload() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const files = useLoaderData<FileUpload[]>();

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

  return (
    <Layout title="Media Library">
      <UploadDropzone onDrop={onDrop} loading={isSubmiting} />
      <Stack>
        <SimpleGrid cols={5} mt="lg">
          {files.map((item) => (
            <Link
              key={item.id}
              to={`/upload/${item.id}`}
              onClick={() => setOpened(true)}
            >
              <video
                src={`/uploads/${item.path}`}
                height={200}
                // fit="cover"
                // radius="sm"
                // withPlaceholder
              />
            </Link>
          ))}
        </SimpleGrid>
        <Pagination page={1} total={10} />
      </Stack>
      <Modal
        size="xl"
        centered
        opened={opened}
        onClose={() => {
          setOpened(false);
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
