"use client";

import { useEffect, useState } from "react";

import { Flex, Loader, Text } from "@mantine/core";
import { parseResponse } from "hono/client";

import AQLOptions from "./AQLOptions";
import ConfigBooleanInput from "./ConfigBooleanInput";
import ConfigInput from "./ConfigInput";
import ConfigNumberInput from "./ConfigNumberInput";

import type { RuleNames } from "@/models/games";
import type { AqlOption, TypedGame } from "@/utils/drizzle/types";

import createApiClient from "@/utils/hono/browser";

type RuleSettingsProps = {
  gameId: string;
  ruleType: RuleNames;
};

/**
 * オンライン版ルール設定コンポーネント
 */
const RuleSettings: React.FC<RuleSettingsProps> = ({ gameId, ruleType }) => {
  const [game, setGame] = useState<TypedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiClient = createApiClient();
        const data = await parseResponse(
          apiClient.games[":gameId"].$get({
            param: { gameId },
          })
        );

        if ("error" in data) {
          setError(data.error);
          return;
        }

        if (data) {
          setGame(data);
        } else {
          setError("設定の取得に失敗しました");
        }
      } catch (err) {
        console.error("Failed to fetch game settings:", err);
        setError("設定の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [gameId]);

  if (loading) {
    return (
      <Flex align="center" gap="md">
        <Loader size="sm" />
        <Text>設定を読み込み中...</Text>
      </Flex>
    );
  }

  if (error || !game) {
    return <Text c="red">{error || "設定の読み込みに失敗しました"}</Text>;
  }

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
        gameId={gameId}
        label="ゲーム名"
        placeholder="ゲーム名を入力"
        value={game.name}
        fieldName="name"
      />

      {/* win_point が必要なルール */}
      {[
        "nomx",
        "nomx-ad",
        "nomr",
        "endless-chance",
        "ny",
        "variables",
        "nbyn",
        "nupdown",
        "squarex",
        "freezex",
        "attacksurvival",
      ].includes(game.ruleType) && (
        <ConfigNumberInput
          gameId={gameId}
          label={
            winPointRules[game.ruleType as keyof typeof winPointRules].name
          }
          value={0}
          fieldName="winPoint"
          max={winPointRules[game.ruleType as keyof typeof winPointRules].max}
          min={winPointRules[game.ruleType as keyof typeof winPointRules].min}
        />
      )}

      {/* lose_point が必要なルール */}
      {[
        "nomx",
        "nomx-ad",
        "nbyn",
        "nupdown",
        "nomr",
        "endless-chance",
      ].includes(game.ruleType) && (
        <ConfigNumberInput
          gameId={gameId}
          label={ruleType === "nomr" ? "休み(M)" : "失格誤答数"}
          value={0}
          fieldName={ruleType === "endless-chance" ? "loseCount" : "losePoint"}
          max={100}
        />
      )}

      {/* NY形式の特殊設定 */}
      {game.ruleType === "ny" && (
        <ConfigNumberInput
          gameId={gameId}
          label="目標ポイント"
          value={game.option.target_point}
          fieldName="targetPoint"
          min={3}
          max={1000}
        />
      )}

      {/* NOMR形式の特殊設定 */}
      {game.ruleType === "nomr" && (
        <ConfigNumberInput
          gameId={gameId}
          label="休み回数"
          value={game.option.rest_count}
          fieldName="restCount"
          max={100}
        />
      )}

      {/* endless-chance形式のNOM休設定 */}
      {game.ruleType === "endless-chance" && (
        <ConfigBooleanInput
          gameId={gameId}
          label="NOM休を利用する"
          helperText="オンにすると、誤答のたびに指定された回数だけ休みとなります。"
          value={game.option.use_r}
          fieldName="useR"
        />
      )}

      {/* nomx-ad形式の連答設定 */}
      {game.ruleType === "nomx-ad" && (
        <ConfigBooleanInput
          gameId={gameId}
          label="3連答以上によるアドバンテージを有効にする"
          helperText="abcの新ルールを使いたい場合はこちらを無効にしてください。"
          value={game.option.streak_over3}
          fieldName="streakOver3"
        />
      )}

      {/* AQL形式のチーム設定 */}
      {ruleType === "aql" && (
        <AQLOptions
          gameId={gameId}
          ruleType={ruleType}
          settings={game.option as AqlOption}
        />
      )}
    </Flex>
  );
};

export default RuleSettings;
