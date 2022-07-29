import { useState } from "react";
import { json } from "@remix-run/node";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { SimpleGrid, Image, Modal, Pagination, Stack } from "@mantine/core";
import { Link, Outlet, useFetcher, useNavigate } from "@remix-run/react";
import { Layout } from "~/components/Layout";
import { UploadDropzone } from "~/features/Upload";
import { fileUpload } from "~/utils/file-upload.server";

export const meta: MetaFunction = () => {
  return {
    title: "Media Library",
    description: "Upload files to the media library",
    path: "/upload",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await fileUpload(request);

  console.log(formData.get("files"));

  return json({});
};

function Upload() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const fetcher = useFetcher();

  const onDrop = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  console.log(fetcher.state);

  return (
    <Layout title="Media Library">
      <UploadDropzone onDrop={onDrop} />
      <Stack>
        <SimpleGrid cols={5} mt="lg">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Link key={i} to={`/upload/${i}`} onClick={() => setOpened(true)}>
              <Image
                src={`https://picsum.photos/id/${i}/200/300`}
                alt="random image"
                height={200}
                fit="cover"
                radius="sm"
                withPlaceholder
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
