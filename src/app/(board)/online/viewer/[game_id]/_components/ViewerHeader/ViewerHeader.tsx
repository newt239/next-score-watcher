"use client";

import { useState } from "react";

import { ActionIcon, Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy, IconShare } from "@tabler/icons-react";

import styles from "./ViewerHeader.module.css";

const ViewerHeader = () => {
  const [shareOpened, { open: openShare, close: closeShare }] =
    useDisclosure(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("URLのコピーに失敗しました:", error);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.title}>
            <Text size="xl" fw={700} c="yellow">
              観戦モード
            </Text>
            <Text size="sm" c="dimmed">
              Score Watcher
            </Text>
          </div>

          <Group gap="sm">
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              onClick={openShare}
              title="シェア"
            >
              <IconShare size={18} />
            </ActionIcon>
          </Group>
        </div>
      </header>

      <Modal
        opened={shareOpened}
        onClose={closeShare}
        title="観戦ページをシェア"
        centered
      >
        <div className={styles.shareContent}>
          <Text size="sm" c="dimmed" mb="md">
            このURLを共有して、他の人もゲームを観戦できます
          </Text>

          <div className={styles.urlContainer}>
            <Text size="sm" className={styles.url}>
              {typeof window !== "undefined" ? window.location.href : ""}
            </Text>
          </div>

          <Group gap="sm" mt="md">
            <Button
              leftSection={<IconCopy size={16} />}
              variant={copied ? "light" : "filled"}
              color={copied ? "green" : "blue"}
              onClick={handleCopyUrl}
              fullWidth
            >
              {copied ? "コピー完了!" : "URLをコピー"}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};

export default ViewerHeader;
