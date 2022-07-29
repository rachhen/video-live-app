import { Paper, Title, Text, Anchor, Container, Stack } from "@mantine/core";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput, FormPasswordInput, SubmitButton } from "~/components/Form";
import { registerValidator } from "~/schemas/auth";
import { createUser } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const result = await registerValidator.validate(formData);

  if (result.error) return validationError(result.error, result.submittedData);

  const user = await createUser(result.data);

  if (!user) {
    return "User register failed";
  }

  return redirect("/login");
};

function Register() {
  const actionData = useActionData();

  return (
    <ValidatedForm validator={registerValidator} method="post">
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Create account!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account{" "}
          <Anchor to="/login" size="sm" component={Link}>
            Login
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack>
            <FormInput label="Name" placeholder="Meow" name="name" />
            <FormInput
              label="Email"
              placeholder="meow@example.com"
              name="email"
            />
            <FormPasswordInput
              label="Password"
              name="password"
              placeholder="Meow password"
            />

            {actionData && (
              <Text size="sm" color="red">
                {actionData}
              </Text>
            )}
            <SubmitButton fullWidth type="submit">
              Register
            </SubmitButton>
          </Stack>
        </Paper>
      </Container>
    </ValidatedForm>
  );
}

export default Register;
