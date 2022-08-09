import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import {
  ActionIcon,
  Badge,
  Button,
  Pagination,
  Stack,
  Table,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { validationError } from "remix-validated-form";

import Streaming from "~/models/streaming.server";
import type { StreamingFindAll } from "~/models/streaming.server";
import { isAuthenticated } from "~/services/auth.server";
import { pagiatedValidator } from "~/schemas/paginated";

import { dateFormat } from "~/utils/date-format";
import { loop } from "~/constants/loop";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request);
  const url = new URL(request.url);
  const result = await pagiatedValidator.validate(url.searchParams);

  if (result.error) return validationError(result.error);

  const streamings = await Streaming.findAll(user.id, result.data);

  return json(streamings);
};

function StreamingPage() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();
  const { data, total } = useLoaderData<StreamingFindAll>();

  const page = +(searchParams.get("page") ?? "1");

  return (
    <Stack spacing="md">
      <div>
        <Button component={Link} to="new">
          New Streaming
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Loop</th>
            <th>Video</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{loop(item.loop.toString())?.label}</td>
              <td>{item.asset.name}</td>
              <td>
                <Badge color={item.status ? "" : "red"}>{item.status}</Badge>
              </td>
              <td>{dateFormat(item.createdAt)}</td>
              <td>
                <ActionIcon
                  size="xs"
                  color="red"
                  onClick={() => {
                    if (confirm("Are you sure?")) {
                      fetcher.submit(
                        {},
                        {
                          action: `/streaming/${item.id}`,
                          method: "delete",
                        }
                      );
                    }
                  }}
                >
                  <IconTrash />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        total={total}
        page={page}
        onChange={(page) => navigate(`/streaming?page=${page}`)}
      />
    </Stack>
  );
}

export default StreamingPage;
