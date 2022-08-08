import { json } from "@remix-run/node";
import { Stack } from "@mantine/core";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";

import Streaming from "~/models/streaming.server";
import { FormInput, FormSelect, SubmitButton } from "~/components";
import { streamingValidator } from "~/schemas/streaming";
import { SelectFile } from "~/features/Streaming";
import { isAuthenticated } from "~/services/auth.server";
import { streamingQueue } from "~/queues/streaming.server";

export const meta: MetaFunction = () => ({
  title: "Streaming",
  content: "Streaming",
  path: "/streaming",
});

export const action: ActionFunction = async ({ request }) => {
  const user = await isAuthenticated(request);
  const formDate = await request.formData();
  const result = await streamingValidator.validate(formDate);

  if (result.error) return validationError(result.error, result.submittedData);

  const streaming = await Streaming.create(user.id, result.data);

  await streamingQueue.add("streaming", streaming);

  return json(streaming);
};

function NewStreaming() {
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
    <ValidatedForm
      validator={streamingValidator}
      method="post"
      defaultValues={{
        rtmps:
          "rtmps://live-api-s.facebook.com:443/rtmp/FB-780484060049653-0-AbwnQDSzUYWxNM61",
      }}
    >
      <Stack>
        <SelectFile name="videoId" />
        <FormInput name="name" label="Name" />
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
  );
}

export default NewStreaming;
