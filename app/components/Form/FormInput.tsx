import type { TextInputProps } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { useField } from "remix-validated-form";

type FormInputProps = TextInputProps & {
  name: string;
};

export function FormInput({ name, ...props }: FormInputProps) {
  const { error, getInputProps } = useField(name);
  return (
    <TextInput error={error} {...props} {...getInputProps({ id: name })} />
  );
}
