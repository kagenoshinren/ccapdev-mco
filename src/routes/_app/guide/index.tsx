import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  TextInput,
  Group,
  Stack,
  Rating,
  Badge,
  Button,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { getEstablishments } from "../../../server/establishments.ts";

export const Route = createFileRoute("/_app/guide/")({
  head: () => ({ meta: [{ title: "Survival Guide | Adormable" }] }),
  loader: () => getEstablishments(),
  component: DirectoryListPage,
});

function DirectoryListPage() {
  const establishments = Route.useLoaderData();
  const [search, setSearch] = useState("");

  const filtered = establishments.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container size="lg" py="xl">
      <Title className="page-title" mb="xs">
        The Survival Guide
      </Title>
      <Text c="dimmed" className="page-description" mb="xl">
        Discover and review local establishments near your dormitory.
      </Text>

      <TextInput
        placeholder="Search establishments by name..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => {
          setSearch(e.currentTarget.value);
        }}
        mb="xl"
        size="md"
      />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {filtered.map((est) => (
          <Card key={est.id} shadow="md" padding="lg" radius="md" className="content-card">
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={700} size="lg">
                  {est.name}
                </Text>
                <Badge variant="light">{est.category}</Badge>
              </Group>
              <Text size="sm" c="dimmed" lineClamp={2}>
                {est.description}
              </Text>
              <Group gap="xs">
                <Rating value={est.rating} fractions={2} readOnly size="sm" />
                <Text size="sm" c="dimmed">
                  ({est.reviews} reviews)
                </Text>
              </Group>
              <Button variant="light" color="pink" fullWidth radius="xl" component={Link} to={`/guide/${est.id}`}>
                View Details
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
