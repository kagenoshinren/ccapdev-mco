import type { DefaultMantineColor } from "@mantine/core";

import tagDiscussion from "../../assets/lobby/tag-discussion.svg";
import tagEvent from "../../assets/lobby/tag-event.svg";
import tagIssue from "../../assets/lobby/tag-issue.svg";
import tagLostFound from "../../assets/lobby/tag-lost-found.svg";

export const TAG_ICONS: Readonly<Record<string, string>> = {
  Discussion: tagDiscussion,
  Issue: tagIssue,
  Event: tagEvent,
  "Lost & Found": tagLostFound,
};

export const TAG_COLORS: Readonly<Record<string, DefaultMantineColor>> = {
  Discussion: "pink",
  Issue: "red",
  Event: "grape",
  "Lost & Found": "yellow",
};

export const DEFAULT_TAGS: { name: string; color: DefaultMantineColor }[] = [
  { name: "Discussion", color: "pink" },
  { name: "Issue", color: "red" },
  { name: "Event", color: "grape" },
  { name: "Lost & Found", color: "yellow" },
];
