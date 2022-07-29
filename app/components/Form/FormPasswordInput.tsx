import type { PasswordInputProps } from "@mantine/core";
import { useField } from "remix-validated-form";
import { PasswordInput } from "@mantine/core";

type FormPasswordInputProps = PasswordInputProps & {
  name: string;
};

export function FormPasswordInput({ name, ...props }: FormPasswordInputProps) {
  const { error, getInputProps } = useField(name);

  return (
    <PasswordInput {...props} {...getInputProps({ id: name })} error={error} />
  );
}
