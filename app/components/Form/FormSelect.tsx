import type { SelectProps } from "@mantine/core";
import { Select } from "@mantine/core";
import { useField } from "remix-validated-form";

type FormSelectProps = SelectProps & {
  name: string;
};

export function FormSelect({ name, ...props }: FormSelectProps) {
  const { error, getInputProps } = useField(name);

  return <Select error={error} {...props} {...getInputProps()} />;
}
