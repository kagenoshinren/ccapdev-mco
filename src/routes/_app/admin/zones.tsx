import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Table,
  Button,
  TextInput,
  NumberInput,
  Badge,
  ActionIcon,
  Modal,
  FileInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconPlus, IconSearch, IconUpload } from "@tabler/icons-react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { SectionHeader } from "../../../components/section-header.tsx";
import { getZonesForAdmin, createZone, updateZone, deleteZone } from "../../../server/zones.ts";

import styles from "./index.module.css";

const FEEDBACK_TIMEOUT_MS = 2000;
const MAX_IMAGE_BYTES = 2_000_000;

export const Route = createFileRoute("/_app/admin/zones")({
  loader: () => getZonesForAdmin(),
  head: () => ({ meta: [{ title: "Study Zones | Adormable" }] }),
  component: ZoneManagerPage,
});

function ZoneManagerPage() {
  const zones = Route.useLoaderData();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number>(10);
  const [seatLabelsText, setSeatLabelsText] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selected, setSelected] = useState<(typeof zones)[0] | null>(null);

  const filtered = zones.filter((z) => z.name.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => {
    setEditId(null);
    setName("");
    setCapacity(10);
    setSeatLabelsText("");
    setImageData(null);
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageData(null);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setSuccessMsg("Image must be under 2 MB");
      setTimeout(() => setSuccessMsg(""), FEEDBACK_TIMEOUT_MS);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    if (selected) {
      await deleteZone({ data: { zoneId: selected.id } });
      setSelected(null);
      closeDelete();
      void router.invalidate();
    }
  };

  const handleSubmit = async () => {
    const seatLabels = seatLabelsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editId == null) {
      if (!name.trim()) return;
      await createZone({
        data: {
          name,
          capacity,
          image: imageData ?? undefined,
          seatLabels: seatLabels.length > 0 ? seatLabels : undefined,
        },
      });
    } else {
      await updateZone({
        data: {
          zoneId: editId,
          name: name || undefined,
          capacity,
          image: imageData ?? undefined,
          seatLabels: seatLabels.length > 0 ? seatLabels : undefined,
        },
      });
    }
    const msg = editId == null ? "Zone created!" : "Zone updated!";
    resetForm();
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), FEEDBACK_TIMEOUT_MS);
    void router.invalidate();
  };

  return (
    <Container size="lg" py="xl" className="pageEnter">
      <Group justify="space-between" mb="xs">
        <SectionHeader
          title="Study Zone Manager"
          description="Create, edit, and manage study areas and their seats."
          mb="xs"
        />
        <Button leftSection={<IconPlus size={16} />} color="pink" radius="xl" onClick={resetForm}>
          Add Zone
        </Button>
      </Group>

      <TextInput
        placeholder="Search zones..."
        leftSection={<IconSearch size={16} />}
        mb="lg"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Paper shadow="md" radius="md" className="content-card">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Capacity</Table.Th>
              <Table.Th>Seats</Table.Th>
              <Table.Th>Reservations</Table.Th>
              <Table.Th>Image</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((zone) => (
              <Table.Tr key={zone.id} className={styles.tableRow}>
                <Table.Td fw={500}>{zone.name}</Table.Td>
                <Table.Td>{zone.capacity}</Table.Td>
                <Table.Td>{zone.seatCount}</Table.Td>
                <Table.Td>{zone.reservations}</Table.Td>
                <Table.Td>
                  <Badge color={zone.hasImage ? "green" : "gray"} variant="light" size="sm">
                    {zone.hasImage ? "Yes" : "None"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon
                      variant="light"
                      size="sm"
                      color="pink"
                      aria-label="Edit zone"
                      onClick={() => {
                        setEditId(zone.id);
                        setName(zone.name);
                        setCapacity(zone.capacity);
                        setSeatLabelsText("");
                        setImageData(null);
                      }}
                    >
                      <IconEdit size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      size="sm"
                      color="red"
                      aria-label="Delete zone"
                      onClick={() => {
                        setSelected(zone);
                        openDelete();
                      }}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {filtered.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed" py="lg">
                    No study zones found.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Delete Confirmation */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Study Zone" centered>
        <Text mb="lg">
          Are you sure you want to delete <strong>{selected?.name}</strong>? All seats and reservations in this zone
          will be removed.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" color="gray" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      {/* Create / Edit Form */}
      <Paper shadow="md" p="lg" radius="md" className="content-card" mt="xl">
        <Title order={4} mb="md">
          {editId == null ? "Add New Study Zone" : "Edit Study Zone"}
        </Title>
        <Stack>
          <Group grow>
            <TextInput
              label="Name"
              placeholder="e.g. Quiet Room A"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <NumberInput label="Capacity" min={1} max={500} value={capacity} onChange={(v) => setCapacity(typeof v === "number" ? v : 10)} />
          </Group>
          <Textarea
            label="Seat Labels (comma-separated)"
            placeholder="A1, A2, A3, B1, B2, B3"
            value={seatLabelsText}
            onChange={(e) => setSeatLabelsText(e.currentTarget.value)}
            autosize
            minRows={2}
          />
          <FileInput
            label="Zone Image"
            placeholder="Upload image (max 2 MB)"
            leftSection={<IconUpload size={16} />}
            accept="image/*"
            onChange={handleImageChange}
          />
          <Group justify="flex-end">
            <Button variant="light" color="gray" onClick={resetForm}>
              Cancel
            </Button>
            <Button color="pink" radius="xl" onClick={handleSubmit}>
              {editId == null ? "Create Zone" : "Save Changes"}
            </Button>
          </Group>
          {successMsg && (
            <Text c={successMsg.includes("under") ? "red" : "green"} size="sm" ta="center">
              {successMsg}
            </Text>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
