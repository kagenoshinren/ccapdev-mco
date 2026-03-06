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

import emptyState from "../../../assets/features/empty-state.svg";
import computerLab from "../../../assets/study-nook/computer-lab.svg";
import groupStudy from "../../../assets/study-nook/group-study.svg";
import mainHall from "../../../assets/study-nook/main-hall.svg";
import quietRoomA from "../../../assets/study-nook/quiet-room-a.svg";
import quietRoomB from "../../../assets/study-nook/quiet-room-b.svg";
import readingRoom from "../../../assets/study-nook/reading-room.svg";

const zones = [
  { id: "main-hall", name: "Main Hall", capacity: 40, available: 12, status: "Open", image: mainHall },
  { id: "quiet-room-a", name: "Quiet Room A", capacity: 10, available: 3, status: "Open", image: quietRoomA },
  { id: "quiet-room-b", name: "Quiet Room B", capacity: 10, available: 0, status: "Full", image: quietRoomB },
  { id: "group-study", name: "Group Study Room", capacity: 20, available: 8, status: "Open", image: groupStudy },
  { id: "computer-lab", name: "Computer Lab", capacity: 30, available: 15, status: "Open", image: computerLab },
  { id: "reading-room", name: "Reading Room", capacity: 15, available: 0, status: "Full", image: readingRoom },
];

export const Route = createFileRoute("/_app/study-nook/")({
  head: () => ({ meta: [{ title: "Study Nook | Adormable" }] }),
  component: ZoneSelectionPage,
});

function ZoneSelectionPage() {
  const [search, setSearch] = useState("");

  const filtered = zones.filter((z) => z.name.toLowerCase().includes(search.toLowerCase()));

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
        <Select placeholder="Filter by availability" data={["All", "Open", "Full"]} defaultValue="All" />
      </Group>

      {filtered.length === 0 && (
        <Stack align="center" py="xl">
          <img src={emptyState} alt="No results found" style={{ width: 200, height: 200, objectFit: "contain" }} />
          <Text c="dimmed" ta="center">No zones match your search.</Text>
        </Stack>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {filtered.map((zone) => {
          const pct = ((zone.capacity - zone.available) / zone.capacity) * 100;
          return (
            <Card key={zone.id} shadow="md" padding="lg" radius="md" className="content-card">
              <img src={zone.image} alt={zone.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "var(--mantine-radius-sm)", marginBottom: "var(--mantine-spacing-sm)" }} />
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
