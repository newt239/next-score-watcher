"use client";

import { useEffect, useState } from "react";

import { Box, Title } from "@mantine/core";

import ConfigInput from "./ConfigInput";
import CopyGame from "./CopyGame";
import DeleteGame from "./DeleteGame";
import ExportGame from "./ExportGame";
import SelectQuizset from "./SelectQuizset";

import type { GamePropsUnion } from "@/utils/types";

import createApiClient from "@/utils/hono/client";

type Props = {
  game: GamePropsUnion;
};

/**
 * オンライン版その他設定コンポーネント
 * クイズセット選択、オプション設定、ゲーム管理機能を提供
 */
const OtherConfig: React.FC<Props> = ({ game }) => {
  const [quizsets, setQuizsets] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuizsets = async () => {
      try {
        const apiClient = createApiClient();
        const response = await apiClient.quizes.$get({ query: {} });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.quizes) {
            const uniqueSetNames = Array.from(
              new Set(
                data.data.quizes
                  .map((quiz) => quiz.category)
                  .filter((category) => category)
              )
            );
            setQuizsets(uniqueSetNames);
          }
        }
      } catch (error) {
        console.error("Failed to fetch quizsets:", error);
      }
    };

    fetchQuizsets();
  }, []);

  return (
    <Box>
      <SelectQuizset
        game_id={game.id}
        game_quiz={game.quiz}
        quizset_names={quizsets}
      />
      <Title order={3} mt="xl">
        オプション
      </Title>
      <ConfigInput
        gameId={game.id}
        label="Discord Webhook"
        placeholder="https://discord.com/api/webhooks/..."
        value={game.discord_webhook_url || ""}
        fieldName="discordWebhookUrl"
      />
      <Title order={3} mt="xl">
        ゲーム
      </Title>
      <CopyGame game={game} />
      <ExportGame game={game} />
      <DeleteGame game={game} />
    </Box>
  );
};

export default OtherConfig;
