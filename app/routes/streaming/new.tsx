import { redirect } from "@remix-run/node";
import { Stack } from "@mantine/core";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";

import Streaming from "~/models/streaming.server";
import { FormInput, FormSelect, SubmitButton } from "~/components";
import { streamingValidator } from "~/schemas/streaming";
import { SelectFile } from "~/features/Streaming";
import { isAuthenticated } from "~/services/auth.server";
import { streamingQueue } from "~/queues/streaming.server";
import { loops, resolutions } from "~/constants";

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

  await streamingQueue.add("streaming", streaming, { jobId: streaming.id });

  return redirect("/streaming?created=true");
};

// https://web.facebook.com/business/help/162540111070395?id=1123223941353904&_rdc=1&_rdr
function NewStreaming() {
  return (
    <ValidatedForm
      validator={streamingValidator}
      method="post"
      defaultValues={{
        rtmps: "rtmps://live-api-s.facebook.com:443/rtmp/",
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
          name="resolution"
          label="Resolution"
          defaultValue={resolutions[0].value}
          data={resolutions}
          styles={{ root: { width: 150 } }}
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
