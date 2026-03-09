import {
  Container,
  Title,
  Text,
  Grid,
  Paper,
  Group,
  Stack,
  Button,
  Select,
  Switch,
  SimpleGrid,
  ActionIcon,
  Badge,
  Tooltip,
} from "@mantine/core";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { TIME_SLOTS, WEEK_DAYS } from "../../../features/study-nook/study-nook.constants.ts";
import { createReservation } from "../../../server/reservations.ts";
import { getZone } from "../../../server/zones.ts";

export const Route = createFileRoute("/_app/study-nook/$zoneId")({
  loader: ({ params }) => getZone({ data: { zoneId: params.zoneId } }),
  component: ReservationPage,
});

function ReservationPage() {
  const zone = Route.useLoaderData();
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [anonymous, setAnonymous] = useState(false);

  // group seats into rows by letter prefix
  const seatRows: { id: string; label: string; taken: boolean }[][] = [];
  let currentRow: typeof seatRows[0] = [];
  let currentLetter = "";
  for (const seat of zone.seats) {
    const letter = seat.label.charAt(0);
    if (letter !== currentLetter && currentRow.length > 0) {
      seatRows.push(currentRow);
      currentRow = [];
    }
    currentLetter = letter;
    currentRow.push(seat);
  }
  if (currentRow.length > 0) seatRows.push(currentRow);

  return (
    <Container size="lg" py="xl">
      <Group mb="md">
        <Link to="/study-nook">
          <Button variant="subtle" color="pink" size="sm">
            ← Back to Zones
          </Button>
        </Link>
      </Group>

      <Title className="page-title" mb="xs">
        {zone.name} - Reserve a Seat
      </Title>
      <Text c="dimmed" mb="xl">
        Click on a green seat to select it, then choose your time slot.
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper shadow="md" p="md" radius="md" className="content-card">
            <Text fw={600} mb="sm" ta="center">
              Seat Map
            </Text>
            <Group justify="center" mb="md" gap="lg">
              <Group gap={6}>
                <div
                  style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: "var(--mantine-color-green-5)" }}
                />
                <Text size="xs">Available</Text>
              </Group>
              <Group gap={6}>
                <div
                  style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: "var(--mantine-color-red-5)" }}
                />
                <Text size="xs">Taken</Text>
              </Group>
              <Group gap={6}>
                <div
                  style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: "var(--mantine-color-pink-5)" }}
                />
                <Text size="xs">Selected</Text>
              </Group>
            </Group>
            <Stack gap="xs" align="center">
              {seatRows.map((row, ri) => (
                <Group key={ri} gap="xs">
                  <Text size="xs" w={20} fw={600}>
                    {row[0].label.charAt(0)}
                  </Text>
                  {row.map((seat) => {
                    const isSelected = selectedSeat === seat.id;
                    return (
                      <Tooltip key={seat.id} label={seat.label}>
                        <ActionIcon
                          size="md"
                          variant="filled"
                          // oxlint-disable-next-line unicorn/no-nested-ternary
                          color={isSelected ? "pink" : seat.taken ? "red" : "green"}
                          onClick={() => {
                            if (!seat.taken) {
                              setSelectedSeat(seat.id);
                            }
                          }}
                          disabled={seat.taken}
                          style={{ cursor: seat.taken ? "not-allowed" : "pointer" }}
                        >
                          <Text size="xs" fw={600}>
                            {seat.label.slice(1)}
                          </Text>
                        </ActionIcon>
                      </Tooltip>
                    );
                  })}
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper shadow="md" p="md" radius="md" className="content-card">
            <Stack>
              <Text fw={600}>Booking Options</Text>
              <SimpleGrid cols={7} spacing="xs">
                {WEEK_DAYS.map((day, idx) => (
                  <Button
                    key={day}
                    size="xs"
                    variant={selectedDay === idx ? "filled" : "light"}
                    onClick={() => {
                      setSelectedDay(idx);
                    }}
                  >
                    {day}
                  </Button>
                ))}
              </SimpleGrid>
              <Select label="Start Time" placeholder="Select time" data={TIME_SLOTS} value={startTime} onChange={setStartTime} />
              <Select label="End Time" placeholder="Select time" data={TIME_SLOTS} value={endTime} onChange={setEndTime} />
              <Switch
                label="Anonymous Reservation"
                description="Your name won't be visible to others"
                checked={anonymous}
                onChange={(e) => {
                  setAnonymous(e.currentTarget.checked);
                }}
              />
              {selectedSeat !== null && (
                <Paper bg="pink.0" p="sm" radius="md">
                  <Text size="sm">
                    Selected seat: <Badge>{zone.seats.find((s: (typeof zone.seats)[number]) => s.id === selectedSeat)?.label ?? selectedSeat}</Badge>
                  </Text>
                </Paper>
              )}
              <Button
                fullWidth
                disabled={selectedSeat === null || !startTime || !endTime}
                color="pink"
                radius="xl"
                onClick={async () => {
                  if (!selectedSeat || !startTime || !endTime) return;
                  const baseDate = new Date();
                  baseDate.setDate(baseDate.getDate() + ((selectedDay - baseDate.getDay() + 7) % 7 || 7));
                  const dateStr = baseDate.toISOString().slice(0, 10);
                  await createReservation({
                    data: {
                      zoneId: zone.id,
                      seatId: selectedSeat,
                      date: `${dateStr}T00:00:00.000Z`,
                      startTime: `${dateStr}T${to24h(startTime)}:00.000Z`,
                      endTime: `${dateStr}T${to24h(endTime)}:00.000Z`,
                      isAnonymous: anonymous,
                    },
                  });
                  router.invalidate();
                }}
              >
                Confirm Reservation
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

function to24h(time: string): string {
  const [rawTime, period] = time.split(" ");
  const [h, m] = rawTime.split(":").map(Number);
  let hour = h;
  if (period === "PM" && h !== 12) hour += 12;
  if (period === "AM" && h === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
