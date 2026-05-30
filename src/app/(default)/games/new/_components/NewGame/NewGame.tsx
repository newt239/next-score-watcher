"use client";

import { useEffect } from "react";

import { Center, Loader, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { getStoredCurrentProfile } from "@/utils/current-profile";
import { MAX_PLAYER_COUNT, createDefaultPlayers, createGame } from "@/utils/functions";
import { rules } from "@/utils/rules";

import classes from "./NewGame.module.css";

import type { RuleNames } from "@/utils/types";

/** rules に存在する形式名のみ受け付けるスキーマ */
const RuleSchema = z.custom<RuleNames>(
  (value) => typeof value === "string" && Object.prototype.hasOwnProperty.call(rules, value)
);

/** players は 0 以上 MAX_PLAYER_COUNT 以下の整数のみ受け付けるスキーマ */
const PlayersSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.number().max(MAX_PLAYER_COUNT));

/** URLパラメータに応じてゲームを作成し、適切な画面へ遷移するコンポーネント */
const NewGame: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const ruleResult = RuleSchema.safeParse(searchParams.get("rule"));
      const playersResult = PlayersSchema.safeParse(searchParams.get("players"));
      const playerCount = playersResult.success ? playersResult.data : null;

      if (!ruleResult.success) {
        notifications.show({
          title: "ゲームを作成できませんでした",
          message: "指定された形式が見つかりませんでした。",
          color: "red",
        });
        router.replace("/rules");
        return;
      }

      const currentProfile = getStoredCurrentProfile();
      const game_id = await createGame(ruleResult.data, currentProfile);
      if (!game_id) {
        notifications.show({
          title: "ゲームを作成できませんでした",
          message: "もう一度お試しください。",
          color: "red",
        });
        router.replace("/rules");
        return;
      }

      if (playerCount !== null) {
        await createDefaultPlayers(game_id, playerCount, currentProfile);
        router.replace(`/games/${game_id}/board`);
      } else {
        router.replace(`/games/${game_id}/config`);
      }
    };

    run();
  }, [router, searchParams]);

  return (
    <Center className={classes.new_game}>
      <Stack align="center" gap="md">
        <Loader />
        <Text>ゲームを作成しています…</Text>
      </Stack>
    </Center>
  );
};

export default NewGame;
