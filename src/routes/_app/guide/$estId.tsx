import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Rating,
  Button,
  Textarea,
  Avatar,
  Badge,
  Divider,
  ActionIcon,
  FileInput,
} from "@mantine/core";
import { IconThumbUp, IconPhoto } from "@tabler/icons-react";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { getEstablishment, createReview } from "../../../server/establishments.ts";

export const Route = createFileRoute("/_app/guide/$estId")({
  loader: ({ params }) => getEstablishment({ data: { estId: params.estId } }),
  component: EstablishmentDetailsPage,
});

function EstablishmentDetailsPage() {
  const data = Route.useLoaderData();
  const { estId } = Route.useParams();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [helpfulSet, setHelpfulSet] = useState<Set<string>>(new Set());
  return (
    <Container size="md" py="xl">
      <Link to="/guide">
        <Button variant="subtle" color="pink" mb="md" size="sm">
          ← Back to Directory
        </Button>
      </Link>

      <Paper shadow="md" p="lg" radius="md" className="content-card" mb="lg">
        <Group justify="space-between" wrap="wrap">
          <Stack gap="xs">
            <Group>
              <Title order={2}>{data.name}</Title>
              <Badge variant="light" size="lg">
                {data.category}
              </Badge>
            </Group>
            <Text c="dimmed">{data.description}</Text>
          </Stack>
          <Stack align="center" gap={4}>
            <Text size="xl" fw={700}>
              {data.rating}
            </Text>
            <Rating value={data.rating} fractions={2} readOnly />
            <Text size="sm" c="dimmed">
              {data.totalReviews} reviews
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Paper shadow="md" p="lg" radius="md" className="content-card" mb="lg">
        <Title order={4} mb="md">
          Write a Review
        </Title>
        <Stack>
          <Group>
            <Text size="sm">Your Rating:</Text>
            <Rating size="lg" value={rating} onChange={setRating} />
          </Group>
          <Textarea
            placeholder="Share your experience..."
            minRows={4}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.currentTarget.value)}
          />
          <Group>
            <FileInput placeholder="Upload images" leftSection={<IconPhoto size={16} />} accept="image/*" multiple />
            <Button
              color="pink"
              radius="xl"
              onClick={async () => {
                if (!rating || !reviewContent.trim()) return;
                await createReview({ data: { establishmentId: estId, rating, content: reviewContent } });
                setRating(0);
                setReviewContent("");
                router.invalidate();
              }}
            >
              Submit Review
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Title order={4} mb="md">
        Reviews ({data.reviews.length})
      </Title>
      <Stack>
        {data.reviews.map((review: (typeof data.reviews)[number]) => (
          <Paper key={review.id} withBorder p="md" radius="md">
            <Group justify="space-between" mb="sm">
              <Group>
                <Avatar color="pink" radius="xl">
                  {review.author
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </Avatar>
                <Stack gap={2}>
                  <Text fw={600}>{review.author}</Text>
                  <Text size="xs" c="dimmed">
                    {review.time}
                  </Text>
                </Stack>
              </Group>
              <Rating value={review.rating} readOnly size="sm" />
            </Group>
            <Text size="sm" mb="sm">
              {review.content}
            </Text>
            <Group>
              <ActionIcon
                variant="subtle"
                color={helpfulSet.has(review.id) ? "pink" : "pink"}
                size="sm"
                onClick={() => {
                  setHelpfulSet((prev) => {
                    const next = new Set(prev);
                    if (next.has(review.id)) next.delete(review.id);
                    else next.add(review.id);
                    return next;
                  });
                }}
              >
                <IconThumbUp size={14} />
              </ActionIcon>
              <Text size="xs" c="dimmed">
                {review.helpful + (helpfulSet.has(review.id) ? 1 : 0)} found helpful
              </Text>
            </Group>
            {review.ownerReply !== null && (
              <>
                <Divider my="sm" />
                <Paper bg="pink.0" p="sm" radius="sm">
                  <Group gap="xs" mb={4}>
                    <Badge size="xs" color="pink">
                      Owner
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {data.ownerName}
                    </Text>
                  </Group>
                  <Text size="sm">{review.ownerReply}</Text>
                </Paper>
              </>
            )}
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
