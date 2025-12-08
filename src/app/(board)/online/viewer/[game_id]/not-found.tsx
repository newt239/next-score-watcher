"use client";

import Link from "next/link";
import { useState } from "react";

import { Group, Input, Text, Title } from "@mantine/core";

import ButtonLink from "@/components/ButtonLink";

const ViewerNotFound = () => {
  const [gameId, setGameId] = useState("");

  return (
    <main style={{ padding: "1rem" }}>
      <Title order={2}>見つかりませんでした</Title>
      <Text>お探しのゲームは存在しないか、非公開に設定されています。</Text>
      <Text>以下のフォームからIDを入力し直してください。</Text>
      <Group gap="sm" my="lg">
        <Input
          placeholder="ゲームID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <ButtonLink
          href={`/online/viewer/${gameId}`}
          disabled={gameId.trim() === ""}
        >
          観戦する
        </ButtonLink>
      </Group>
      <Text>
        <Link href="https://score-watcher.com/">
          https://score-watcher.com/
        </Link>
      </Text>
    </main>
  );
};

export default ViewerNotFound;
