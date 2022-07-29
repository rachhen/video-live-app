import {
  Paper,
  Title,
  Text,
  Anchor,
  Container,
  Group,
  Checkbox,
  Stack,
} from "@mantine/core";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { ValidatedForm } from "remix-validated-form";
import { FormInput, FormPasswordInput, SubmitButton } from "~/components/Form";
import { loginValidator } from "~/schemas/auth";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return json(error.message, 400);
    }
    return json("Somthing went wrong!", 400);
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  return json({});
};

function Login() {
  const actionData = useActionData();

  return (
    <ValidatedForm validator={loginValidator} method="post">
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor to="/register" size="sm" component={Link}>
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack>
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
            <Group position="apart">
              <Checkbox label="Remember me" />
              <Anchor<"a">
                onClick={(event) => event.preventDefault()}
                href="#"
                size="sm"
              >
                Forgot password?
              </Anchor>
            </Group>
            {actionData && (
              <Text size="sm" color="red">
                {actionData}
              </Text>
            )}
            <SubmitButton fullWidth type="submit">
              Login
            </SubmitButton>
          </Stack>
        </Paper>
      </Container>
    </ValidatedForm>
  );
}

export default Login;
