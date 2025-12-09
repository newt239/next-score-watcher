import type { Metadata } from "next";

import { Flex } from "@mantine/core";
import { parseResponse } from "hono/client";

import ConfigBooleanInput from "../_components/ConfigBooleanInput";
import ConfigInput from "../_components/ConfigInput";
import ConfigNumberInput from "../_components/ConfigNumberInput";

import AQLOptions from "./_components/AQLOptions";

import type { AqlOption } from "@/utils/drizzle/types";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "形式設定",
};

type RulePageProps = {
  params: Promise<{ game_id: string }>;
};

/**
 * 形式設定ページ
 */
const RulePage = async ({ params }: RulePageProps) => {
  const { game_id } = await params;

  const apiClient = await createApiClientOnServer();

  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );

  if ("error" in gameData) {
    return "ゲーム情報の取得に失敗しました";
  }

  const game = gameData.data;
  const ruleType = game.ruleType;

  const winPointRules = {
    nomx: { name: "勝ち抜けポイント", max: 1000, min: undefined },
    "nomx-ad": { name: "勝ち抜けポイント", max: 1000, min: undefined },
    nomr: { name: "休み(M)", max: 100, min: undefined },
    "endless-chance": { name: "失格誤答数", max: 100, min: undefined },
    ny: { name: "勝ち抜けポイント", max: 1000, min: 3 },
    variables: { name: "勝ち抜けポイント", max: 1000, min: 3 },
    nbyn: { name: "N", max: 10, min: undefined },
    nupdown: { name: "N", max: 10, min: undefined },
    squarex: { name: "IconX", max: 100, min: undefined },
    freezex: { name: "IconX", max: 100, min: undefined },
    attacksurvival: { name: "勝ち抜け人数", max: 1000, min: undefined },
  };

  return (
    <Flex direction="column" gap="lg">
      {/* ゲーム名 */}
      <ConfigInput
        gameId={game.id}
        label="ゲーム名"
        placeholder="ゲーム名を入力"
        value={game.name}
        fieldName="name"
      />

      {/* win_point が必要なルール */}
      {(game.ruleType === "nomx" ||
        game.ruleType === "nomx-ad" ||
        game.ruleType === "nomr" ||
        game.ruleType === "endless-chance" ||
        game.ruleType === "ny" ||
        game.ruleType === "variables" ||
        game.ruleType === "nbyn" ||
        game.ruleType === "nupdown" ||
        game.ruleType === "squarex" ||
        game.ruleType === "freezex" ||
        game.ruleType === "attacksurvival") && (
        <ConfigNumberInput
          gameId={game.id}
          label={winPointRules[game.ruleType as keyof typeof winPointRules].name}
          value={game.option.win_point}
          fieldName="win_point"
          max={winPointRules[game.ruleType as keyof typeof winPointRules].max}
          min={winPointRules[game.ruleType as keyof typeof winPointRules].min}
        />
      )}

      {/* lose_point が必要なルール */}
      {(game.ruleType === "nomx" ||
        game.ruleType === "nomx-ad" ||
        game.ruleType === "nbyn" ||
        game.ruleType === "nupdown" ||
        game.ruleType === "nomr") && (
        <ConfigNumberInput
          gameId={game.id}
          label={ruleType === "nomr" ? "休み(M)" : "失格誤答数"}
          value={game.option.lose_point}
          fieldName="lose_point"
          max={100}
        />
      )}

      {/* lose_count が必要なルール */}
      {game.ruleType === "endless-chance" && (
        <ConfigNumberInput
          gameId={game.id}
          label="失格誤答数"
          value={game.option.lose_count}
          fieldName="lose_count"
          max={100}
        />
      )}

      {/* NY形式の特殊設定 */}
      {game.ruleType === "ny" && (
        <ConfigNumberInput
          gameId={game.id}
          label="目標ポイント"
          value={game.option.target_point}
          fieldName="target_point"
          min={3}
          max={1000}
        />
      )}

      {/* NOMR形式の特殊設定 */}
      {game.ruleType === "nomr" && (
        <ConfigNumberInput
          gameId={game.id}
          label="休み回数"
          value={game.option.rest_count}
          fieldName="rest_count"
          max={100}
        />
      )}

      {/* endless-chance形式のNOM休設定 */}
      {game.ruleType === "endless-chance" && (
        <ConfigBooleanInput
          gameId={game.id}
          label="NOM休を利用する"
          helperText="オンにすると、誤答のたびに指定された回数だけ休みとなります。"
          value={game.option.use_r}
          fieldName="use_r"
        />
      )}

      {/* nomx-ad形式の連答設定 */}
      {game.ruleType === "nomx-ad" && (
        <ConfigBooleanInput
          gameId={game.id}
          label="3連答以上によるアドバンテージを有効にする"
          helperText="abcの新ルールを使いたい場合はこちらを無効にしてください。"
          value={game.option.streak_over3}
          fieldName="streak_over3"
        />
      )}

      {/* AQL形式のチーム設定 */}
      {ruleType === "aql" && (
        <AQLOptions gameId={game.id} ruleType={ruleType} settings={game.option as AqlOption} />
      )}
    </Flex>
  );
};

export default RulePage;
