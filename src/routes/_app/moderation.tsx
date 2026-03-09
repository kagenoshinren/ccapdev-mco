import { Container, Title, Text, Paper, Group, Stack, Badge, Button, Avatar, ActionIcon, Select } from "@mantine/core";
import { IconTrash, IconBan } from "@tabler/icons-react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { getReports, resolveReport, createBan } from "../../server/moderation.ts";
import { getUsers } from "../../server/admin.ts";

const reasonColors: Record<string, string> = { Harassment: "red", Spam: "orange", Misinformation: "yellow" };

export const Route = createFileRoute("/_app/moderation")({
  head: () => ({ meta: [{ title: "Moderation | Adormable" }] }),
  loader: async () => {
    const [reports, users] = await Promise.all([getReports(), getUsers()]);
    return { reports, users };
  },
  component: ForumModerationPage,
});

function ForumModerationPage() {
  const { reports: flaggedPosts, users } = Route.useLoaderData();
  const router = useRouter();
  const [banUser, setBanUser] = useState<string | null>(null);
  const [banDuration, setBanDuration] = useState<string | null>(null);

  const durationMap: Record<string, number> = {
    "1 Day": 1,
    "3 Days": 3,
    "7 Days": 7,
    "14 Days": 14,
    "30 Days": 30,
  };
  return (
    <Container size="lg" py="xl">
      <Title className="page-title" mb="xs">
        Forum Moderation
      </Title>
      <Text c="dimmed" className="page-description" mb="xl">
        Review flagged content and manage user behavior.
      </Text>

      <Paper shadow="md" p="lg" radius="md" className="content-card" mb="xl">
        <Title order={4} mb="md">
          Report Queue ({flaggedPosts.length})
        </Title>

        <Stack>
          {flaggedPosts.map((post) => (
            <Paper key={post.id} withBorder p="md" radius="md">
              <Group justify="space-between" wrap="wrap">
                <Group>
                  <Avatar color="red" radius="xl" size="sm">
                    {post.author.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Stack gap={2}>
                    <Text fw={600}>{post.title}</Text>
                    <Text size="xs" c="dimmed">
                      By {post.author} · {post.date} · {post.reports} reports
                    </Text>
                  </Stack>
                </Group>
                <Group gap="xs">
                  <Badge color={reasonColors[post.reason]} variant="light">
                    {post.reason}
                  </Badge>
                  <Button
                    size="xs"
                    variant="light"
                    color="pink"
                    onClick={async () => {
                      await resolveReport({ data: { reportId: post.id, action: "resolve" } });
                      router.invalidate();
                    }}
                  >
                    Review
                  </Button>
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="sm"
                    onClick={async () => {
                      await resolveReport({ data: { reportId: post.id, action: "delete" } });
                      router.invalidate();
                    }}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Paper shadow="md" p="lg" radius="md" className="content-card">
        <Title order={4} mb="md">
          <Group gap="xs">
            <IconBan size={18} />
            Issue Temporary Ban
          </Group>
        </Title>
        <Group grow>
          <Select
            label="Select User"
            placeholder="Search user..."
            data={users.map((u) => ({ value: u.id, label: u.name }))}
            searchable
            value={banUser}
            onChange={setBanUser}
          />
          <Select
            label="Ban Duration"
            placeholder="Select duration"
            data={["1 Day", "3 Days", "7 Days", "14 Days", "30 Days"]}
            value={banDuration}
            onChange={setBanDuration}
          />
        </Group>
        <Group justify="flex-end" mt="md">
          <Button
            color="red"
            radius="xl"
            onClick={async () => {
              if (!banUser || !banDuration) return;
              await createBan({ data: { userId: banUser, reason: "Manual ban", durationDays: durationMap[banDuration] } });
              setBanUser(null);
              setBanDuration(null);
              router.invalidate();
            }}
          >
            Issue Ban
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
