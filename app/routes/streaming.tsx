import { json } from "@remix-run/node";
import { Paper, Stack } from "@mantine/core";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput, FormSelect, Layout, SubmitButton } from "~/components";
import { streamingValidator } from "~/schemas/streaming";
import { queue } from "~/queues/download.server";

export const meta: MetaFunction = () => ({
  title: "Streaming",
  content: "Streaming",
  path: "/streaming",
});

export const action: ActionFunction = async ({ request }) => {
  const formDate = await request.formData();
  const result = await streamingValidator.validate(formDate);
  if (result.error) return validationError(result.error, result.submittedData);

  console.log(result.data);

  await queue.add("download", { url: result.data.videoUrl });

  return json({});
};

function Streaming() {
  const loops = [
    { value: "0", label: "No Loop" },
    { value: "1", label: "Loop 1 time" },
    { value: "2", label: "Loop 2 times" },
    { value: "3", label: "Loop 3 times" },
    { value: "5", label: "Loop 5 times" },
    { value: "7", label: "Loop 7 times" },
    { value: "10", label: "Loop 10 times" },
    { value: "-1", label: "Loop forever" },
  ];

  return (
    <Layout title="Streaming">
      <Paper withBorder p="md">
        <ValidatedForm
          validator={streamingValidator}
          method="post"
          defaultValues={{
            rtmps:
              "rtmps://live-api-s.facebook.com:443/rtmp/FB-780484060049653-0-AbwnQDSzUYWxNM61",
          }}
        >
          <Stack>
            <FormInput name="videoUrl" label="Video URL" />
            <FormInput
              name="rtmps"
              label="RTMP link"
              autoComplete="off"
              description="Example: rtmp(s)://<domain>/<streamkey>"
            />
            <FormSelect
              name="loop"
              label="Loop"
              defaultValue={loops[0].value}
              data={loops}
              styles={{ root: { width: 150 } }}
            />
            <SubmitButton styles={{ root: { width: 150 } }}>Start</SubmitButton>
          </Stack>
        </ValidatedForm>
      </Paper>
    </Layout>
  );
}

export default Streaming;
