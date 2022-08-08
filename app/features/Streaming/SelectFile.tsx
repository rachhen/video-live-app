import { useEffect, useState } from "react";
import {
  AspectRatio,
  Button,
  createStyles,
  Modal,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useFetcher } from "@remix-run/react";
import { useField } from "remix-validated-form";

import type { FindAllAsset } from "~/models/asset.server";
import type { Asset } from "@prisma/client";

type SelectFileProps = {
  name: string;
};

export function SelectFile({ name }: SelectFileProps) {
  const { error, getInputProps } = useField(name);
  const [page, setPage] = useState(1);
  const [opened, handlers] = useDisclosure(false);
  const fetcher = useFetcher<FindAllAsset>();
  const [tmp, setTmp] = useState<Asset | undefined>();
  const [selected, setSelected] = useState<Asset | undefined>();
  const { classes, cx } = useStyles();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("/upload");
    }
  }, [fetcher]);

  const input = getInputProps();

  return (
    <div>
      <input type="hidden" {...input} />
      <Modal
        opened={opened}
        onClose={() => handlers.close()}
        title="Videos"
        size="70%"
      >
        <Stack>
          <SimpleGrid cols={5} mt="lg">
            {fetcher.data?.data.map((item) => (
              <Paper
                withBorder
                key={item.id}
                onClick={() => setTmp(item)}
                className={cx(classes.videoItme, {
                  [classes.videoSelected]: tmp?.id === item.id,
                })}
              >
                <AspectRatio ratio={16 / 9}>
                  <video src={`/uploads/${item.path}`} controls />
                </AspectRatio>
                <Text p="xs" size="sm">
                  {item.name}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
          <div className={classes.footer}>
            <Pagination
              total={fetcher.data?.total ?? 0}
              page={page}
              onChange={(page) => {
                setPage(page);
                fetcher.load(`/upload?page=${page}`);
              }}
            />
            <Button
              onClick={() => {
                if (tmp) {
                  input.onChange?.(tmp.id);
                  setSelected(tmp);
                  handlers.close();
                }
              }}
            >
              OK
            </Button>
          </div>
        </Stack>
      </Modal>
      {selected && (
        <Paper withBorder className={classes.videoPreview}>
          <AspectRatio ratio={16 / 9}>
            <video src={`/uploads/${selected.path}`} controls />
          </AspectRatio>
          <Text p="xs" size="sm">
            {selected.name}
          </Text>
        </Paper>
      )}
      <Button onClick={handlers.open}>Select Video</Button>
      {error && (
        <Text color="red" size="xs" pt={3}>
          {error}
        </Text>
      )}
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  videoItme: {
    cursor: "pointer",
  },
  videoSelected: {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: theme.colors.blue[4],
  },
  videoPreview: {
    width: 250,
    marginBottom: theme.spacing.md,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));
