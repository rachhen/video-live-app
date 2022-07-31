import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";
import { useIsSubmitting } from "remix-validated-form";

export const SubmitButton = (props: ButtonProps) => {
  const isSubmitting = useIsSubmitting();

  return <Button type="submit" {...props} loading={isSubmitting} />;
};
