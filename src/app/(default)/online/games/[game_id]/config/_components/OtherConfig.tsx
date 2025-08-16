"use client";

import { useEffect, useState } from "react";

import { Box, Title } from "@mantine/core";

import ConfigInput from "./ConfigInput";
import CopyGame from "./CopyGame";
import DeleteGame from "./DeleteGame";
import ExportGame from "./ExportGame";
import SelectQuizset from "./SelectQuizset";

import type { RuleNames } from "@/models/games";

import createApiClient from "@/utils/hono/browser";

type Props = {
  gameId: string;
  gameName: string;
  ruleType: RuleNames;
  discordWebhookUrl: string;
};

/**
 * オンライン版その他設定コンポーネント
 * クイズセット選択、オプション設定、ゲーム管理機能を提供
 */
const OtherConfig: React.FC<Props> = ({
  gameId,
  gameName,
  ruleType,
  discordWebhookUrl,
}) => {
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
        game_id={gameId}
        game_quiz={undefined}
        quizset_names={quizsets}
      />
      <Title order={3} mt="xl">
        オプション
      </Title>
      <ConfigInput
        gameId={gameId}
        label="Discord Webhook"
        placeholder="https://discord.com/api/webhooks/..."
        value={discordWebhookUrl}
        fieldName="discordWebhookUrl"
      />
      <Title order={3} mt="xl">
        ゲーム
      </Title>
      <CopyGame
        gameId={gameId}
        gameName={gameName}
        ruleType={ruleType}
        discordWebhookUrl={discordWebhookUrl}
      />
      <ExportGame gameId={gameId} ruleType={ruleType} />
      <DeleteGame gameId={gameId} gameName={gameName} ruleType={ruleType} />
    </Box>
  );
};

export default OtherConfig;
