import { Container, Title, Text, Paper, Group, Table, Badge, Select, TextInput, Tabs } from "@mantine/core";
import { IconSearch, IconUser } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { getActivityLogs } from "../../../server/admin.ts";

const typeColors: Record<string, string> = { Reservation: "pink", Forum: "grape", Admin: "red", Review: "teal" };

export const Route = createFileRoute("/_app/admin/logs")({
  head: () => ({ meta: [{ title: "Logs | Adormable" }] }),
  loader: () => getActivityLogs(),
  component: SystemLogsPage,
});

function SystemLogsPage() {
  const activityLogs = Route.useLoaderData();
  return (
    <Container size="lg" py="xl">
      <Title className="page-title" mb="xs">
        System Logs
      </Title>
      <Text c="dimmed" className="page-description" mb="xl">
        Audit trails and technical error monitoring.
      </Text>

      <Tabs defaultValue="activity">
        <Tabs.List>
          <Tabs.Tab value="activity" leftSection={<IconUser size={16} />}>
            User Activity
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="activity" pt="md">
          <Paper shadow="md" radius="md" className="content-card">
            <Group p="md" justify="space-between">
              <TextInput placeholder="Search logs..." leftSection={<IconSearch size={16} />} size="sm" />
              <Select
                placeholder="Filter by type"
                data={["All", "Reservation", "Forum", "Admin", "Review"]}
                defaultValue="All"
                size="sm"
              />
            </Group>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Timestamp</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th>Type</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {activityLogs.map((log) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="sm" c="dimmed" ff="monospace">
                        {log.timestamp}
                      </Text>
                    </Table.Td>
                    <Table.Td fw={500}>{log.user}</Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.action}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={typeColors[log.type]} variant="light" size="sm">
                        {log.type}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
