import { Container, Text, Card, Group, Stack, Avatar, Badge, ActionIcon, Chip } from "@mantine/core";
import { IconArrowUp, IconPlus, IconMessageCircle } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import emptyState from "../../../assets/features/empty-state.svg";
import { EmptyState } from "../../../components/empty-state.tsx";
import { LinkButton } from "../../../components/link-button.tsx";
import { SearchBar } from "../../../components/search-bar.tsx";
import { SectionHeader } from "../../../components/section-header.tsx";
import { TAG_COLORS } from "../../../features/lobby/lobby.constants.ts";

import styles from "./lobby.module.css";

const posts = [
  {
    id: "1",
    title: "Best study spots in the dorm?",
    author: "Maria Santos",
    snippet: "I've been looking for quiet places to study after 9 PM. Any suggestions from fellow residents?",
    upvotes: 24,
    comments: 8,
    tag: "Discussion",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "Wi-Fi Issues on Floor 3",
    author: "Juan Reyes",
    snippet: "Anyone else experiencing slow internet on the 3rd floor? It's been like this for a week now.",
    upvotes: 42,
    comments: 15,
    tag: "Issue",
    time: "5 hours ago",
  },
  {
    id: "3",
    title: "Movie night this Saturday!",
    author: "Ava Cruz",
    snippet: "We're organizing a movie night in the common area. Bring snacks! Vote for the movie below.",
    upvotes: 67,
    comments: 23,
    tag: "Event",
    time: "1 day ago",
  },
  {
    id: "4",
    title: "Lost AirPods in laundry room",
    author: "Carlos Lim",
    snippet:
      "Left my AirPods Pro in the 2nd floor laundry room yesterday. White case with a blue sticker. Please DM if found!",
    upvotes: 11,
    comments: 3,
    tag: "Lost & Found",
    time: "1 day ago",
  },
] as const;

const ALL_TAGS = ["All", "Discussion", "Issue", "Event", "Lost & Found"] as const;

export const Route = createFileRoute("/_app/lobby/")({
  head: () => ({ meta: [{ title: "Lobby | Adormable" }] }),
  component: ForumFeedPage,
});

function ForumFeedPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");

  const filtered = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) || p.snippet.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === "All" || p.tag === activeTag;
    return matchesSearch && matchesTag;
  });

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="xs">
        <SectionHeader
          title="The Virtual Lobby"
          description="Discuss, share, and connect with fellow dormitory residents."
          color="grape"
          mb="xs"
        />
        <LinkButton leftSection={<IconPlus size={16} />} color="grape" radius="xl" to="/lobby">
          New Post
        </LinkButton>
      </Group>

      <SearchBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search posts..."
        filterData={["Newest", "Most Popular"]}
        filterPlaceholder="Sort by"
        filterValue="Newest"
        onFilterChange={() => {}}
      />

      <Chip.Group
        value={activeTag}
        onChange={(v) => {
          setActiveTag(v as string);
        }}
      >
        <Group gap="xs" mb="lg">
          {ALL_TAGS.map((tag) => (
            <Chip key={tag} value={tag} variant="light" color={tag === "All" ? "gray" : TAG_COLORS[tag]} size="sm">
              {tag}
            </Chip>
          ))}
        </Group>
      </Chip.Group>

      {filtered.length === 0 && <EmptyState image={emptyState} message="No posts match your search." />}

      <Stack>
        {filtered.map((post) => (
          <Card
            key={post.id}
            shadow="sm"
            padding="md"
            radius="md"
            className={styles.postCard}
            component={Link}
            to={`/lobby/${post.id}`}
          >
            <Group wrap="nowrap" gap="md">
              <Stack align="center" gap={2} className={styles.voteColumn}>
                <ActionIcon variant="subtle" color="grape" size="sm" aria-label="Upvote">
                  <IconArrowUp size={16} />
                </ActionIcon>
                <Text size="sm" fw={700} c="grape">
                  {post.upvotes}
                </Text>
              </Stack>

              <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                <Group gap="xs" wrap="nowrap">
                  <Avatar color="grape" radius="xl" size="sm">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>
                  <Text size="xs" c="dimmed">
                    {post.author} · {post.time}
                  </Text>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <Text fw={600} size="sm" lineClamp={1}>
                    {post.title}
                  </Text>
                  <Badge color={TAG_COLORS[post.tag]} size="xs" variant="light" style={{ flexShrink: 0 }}>
                    {post.tag}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {post.snippet}
                </Text>
                <Group gap="xs">
                  <IconMessageCircle size={12} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    {post.comments} replies
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
