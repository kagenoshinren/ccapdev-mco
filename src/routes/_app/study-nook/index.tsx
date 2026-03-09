import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Group,
  TextInput,
  Select,
  Stack,
  Button,
  Progress,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { getZones } from "../../../server/zones.ts";

export const Route = createFileRoute("/_app/study-nook/")({
  head: () => ({ meta: [{ title: "Study Nook | Adormable" }] }),
  loader: () => getZones(),
  component: ZoneSelectionPage,
});

function ZoneSelectionPage() {
  const zones = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<string | null>("All");

  const filtered = zones
    .filter((z) => z.name.toLowerCase().includes(search.toLowerCase()))
    .filter((z) => {
      if (availability === "Open") return z.status === "Open";
      if (availability === "Full") return z.status === "Full";
      return true;
    });

  return (
    <Container size="lg" py="xl">
      <Title className="page-title" mb="xs">
        The Study Nook
      </Title>
      <Text c="dimmed" className="page-description" mb="xl">
        Choose a zone to reserve your study spot.
      </Text>

      <Group mb="xl" grow>
        <TextInput
          placeholder="Search zones..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
        <Select placeholder="Filter by availability" data={["All", "Open", "Full"]} value={availability} onChange={setAvailability} />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {filtered.map((zone) => {
          const pct = ((zone.capacity - zone.available) / zone.capacity) * 100;
          return (
            <Card key={zone.id} shadow="md" padding="lg" radius="md" className="content-card">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="lg">
                    {zone.name}
                  </Text>
                  <Badge color={zone.status === "Open" ? "green" : "red"} variant="light">
                    {zone.status}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  {zone.available} / {zone.capacity} seats available
                </Text>
                {/* oxlint-disable-next-line unicorn/no-nested-ternary */}
                <Progress value={pct} color={pct > 80 ? "red" : pct > 50 ? "yellow" : "green"} size="sm" />
                <Button
                  fullWidth
                  color="pink"
                  radius="xl"
                  component={Link}
                  to={`/study-nook/${zone.id}`}
                  disabled={zone.status === "Full"}
                >
                  {zone.status === "Full" ? "No Spots Available" : "View & Reserve"}
                </Button>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}
