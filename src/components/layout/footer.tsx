import { ActionIcon, Container, Group, Text } from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import adormableLogo from "../../assets/logos/adormable-logo.png";
import { FOOTER_ITEMS } from "../../data/footer-items.ts";

import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.root}>
      <Container size="xl">
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <img src={adormableLogo} alt="Adormable" height={36} />
            <Text size="sm" c="dimmed" className={styles.description}>
              Your all-in-one dormitory companion since 2026.
            </Text>
          </div>
          <div className={styles.linksSection}>
            {FOOTER_ITEMS.map((group) => (
              <div className={styles.linksWrapper} key={group.title}>
                <Text className={styles.linksTitle}>{group.title}</Text>
                {group.links.map((link) => (
                  <Text key={link.label} className={styles.link} component={Link} to={link.to}>
                    {link.label}
                  </Text>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.bottomBar}>
          <Text c="dimmed" size="sm">
            &copy; 2026 Adormable All rights reserved.
          </Text>
          <Group gap={0} className={styles.socialsSection} justify="flex-end" wrap="nowrap">
            <ActionIcon size="lg" variant="subtle" color="blue">
              <IconBrandTwitter size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg" variant="subtle" color="indigo">
              <IconBrandFacebook size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg" variant="subtle" color="grape">
              <IconBrandInstagram size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </div>
      </Container>
    </footer>
  );
}
