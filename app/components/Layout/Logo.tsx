import { Group, Text, ThemeIcon } from "@mantine/core";
import { IconCast } from "@tabler/icons";

function Logo() {
  return (
    <Group>
      <ThemeIcon variant="gradient" gradient={{ from: "red", to: "blue" }}>
        <IconCast />
      </ThemeIcon>
      <Text
        my={0}
        size="md"
        weight={600}
        component="h1"
        variant="gradient"
        gradient={{ from: "red", to: "blue" }}
      >
        Live App
      </Text>
    </Group>
  );
}

export default Logo;
