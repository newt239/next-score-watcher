import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Box, Title } from "@mantine/core";
import { parseResponse } from "hono/client";

import ConfigInput from "../_components/ConfigInput";

import CopyGame from "./_components/CopyGame";
import DeleteGame from "./_components/DeleteGame";
import ExportGame from "./_components/ExportGame";
import PublicityToggle from "./_components/PublicityToggle";
import SelectQuizset from "./_components/SelectQuizset";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "その他の設定",
};

type OtherPageProps = {
  params: Promise<{ game_id: string }>;
};

/**
 * その他の設定ページ
 */
const OtherPage = async ({ params }: OtherPageProps) => {
  const { game_id } = await params;

  const apiClient = await createApiClientOnServer();
  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );

  if ("error" in gameData) {
    return notFound();
  }

  const game = gameData.data;

  // クイズセット一覧を取得
  const response = await parseResponse(apiClient.quizes.$get({ query: {} }));
  if ("error" in response) {
    return notFound();
  }

  return (
    <Box>
      <SelectQuizset
        game_id={game.id}
        game_quiz={undefined}
        quizset_names={response.data.quizes.map((quiz) => quiz.setName)}
      />
      <Title order={3} mt="xl">
        公開設定
      </Title>
      <PublicityToggle gameId={game.id} isPublic={game.isPublic} gameName={game.name} />
      <Title order={3} mt="xl">
        オプション
      </Title>
      <ConfigInput
        gameId={game.id}
        label="Discord Webhook"
        placeholder="https://discord.com/api/webhooks/..."
        value={game.discordWebhookUrl || ""}
        fieldName="discordWebhookUrl"
      />
      <Title order={3} mt="xl">
        ゲーム
      </Title>
      <CopyGame
        gameId={game.id}
        gameName={game.name}
        ruleType={game.ruleType}
        discordWebhookUrl={game.discordWebhookUrl || ""}
      />
      <ExportGame gameId={game.id} ruleType={game.ruleType} />
      <DeleteGame gameId={game.id} gameName={game.name} ruleType={game.ruleType} />
    </Box>
  );
};

export default OtherPage;
