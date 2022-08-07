import type { DropzoneProps } from "@mantine/dropzone";
import { Group, useMantineTheme, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload, IconX, IconCloudUpload } from "@tabler/icons";

export function UploadDropzone(props: Omit<DropzoneProps, "children">) {
  const theme = useMantineTheme();

  return (
    <Dropzone
      onReject={(files) => console.log("rejected files", files)}
      multiple={false}
      accept={["video/*"]}
      {...props}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconCloudUpload size={50} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag video here or click to select video
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many videos as you like, each file should not exceed 5gb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
