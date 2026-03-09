import {
  Container,
  Title,
  Text,
  TextInput,
  Select,
  Card,
  Group,
  Stack,
  Avatar,
  Badge,
  Button,
  ActionIcon,
  Modal,
  Textarea,
} from "@mantine/core";
import { IconSearch, IconArrowUp, IconPlus } from "@tabler/icons-react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { TAG_COLORS } from "../../../features/lobby/lobby.constants.ts";
import { createThread, getThreads } from "../../../server/threads.ts";

export const Route = createFileRoute("/_app/lobby/")({
  head: () => ({ meta: [{ title: "Lobby | Adormable" }] }),
  loader: () => getThreads(),
  component: ForumFeedPage,
});

function ForumFeedPage() {
  const posts = Route.useLoaderData();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string | null>("Newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState<string | null>(null);

  const filtered = posts
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) || p.snippet.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => (sort === "Most Popular" ? b.upvotes - a.upvotes : 0));

  return (
    <Container size="md" py="xl">
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Create New Post" centered>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Post title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.currentTarget.value)}
          />
          <Select
            label="Tag"
            placeholder="Select tag"
            data={Object.keys(TAG_COLORS)}
            value={newTag}
            onChange={setNewTag}
          />
          <Textarea
            label="Content"
            placeholder="Write your post..."
            minRows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.currentTarget.value)}
          />
          <Group justify="flex-end">
            <Button
              color="pink"
              radius="xl"
              onClick={async () => {
                if (!newTitle.trim() || !newContent.trim()) return;
                await createThread({ data: { title: newTitle, content: newContent, tag: newTag ?? undefined } });
                setNewTitle("");
                setNewContent("");
                setNewTag(null);
                setModalOpen(false);
                router.invalidate();
              }}
            >
              Create Post
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Group justify="space-between" mb="xs">
        <Title className="page-title">The Virtual Lobby</Title>
        <Button leftSection={<IconPlus size={16} />} color="pink" radius="xl" onClick={() => setModalOpen(true)}>
          New Post
        </Button>
      </Group>
      <Text c="dimmed" className="page-description" mb="xl">
        Discuss, share, and connect with fellow dormitory residents.
      </Text>

      <Group mb="lg" grow>
        <TextInput
          placeholder="Search posts..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
        <Select placeholder="Sort by" data={["Newest", "Most Popular"]} value={sort} onChange={setSort} />
      </Group>

      <Stack>
        {filtered.map((post) => (
          <Card
            key={post.id}
            shadow="md"
            padding="lg"
            radius="md"
            className="content-card"
            component={Link}
            to={`/lobby/${post.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Group justify="space-between" wrap="wrap">
              <Group>
                <Avatar color="pink" radius="xl">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
                <Stack gap={2}>
                  <Group gap="xs">
                    <Text fw={600}>{post.title}</Text>
                    <Badge color={TAG_COLORS[post.tag as keyof typeof TAG_COLORS]} size="sm" variant="light">
                      {post.tag}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {post.author} · {post.time}
                  </Text>
                </Stack>
              </Group>
              <Group gap="xs">
                <ActionIcon variant="light" color="pink" size="sm">
                  <IconArrowUp size={14} />
                </ActionIcon>
                <Text size="sm" fw={600}>
                  {post.upvotes}
                </Text>
                <Text size="xs" c="dimmed">
                  · {post.comments} replies
                </Text>
              </Group>
            </Group>
            <Text size="sm" c="dimmed" mt="sm" lineClamp={2}>
              {post.snippet}
            </Text>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
