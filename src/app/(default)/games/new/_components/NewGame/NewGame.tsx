"use client";

import { useEffect } from "react";

import { Center, Loader, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter, useSearchParams } from "next/navigation";

import { getStoredCurrentProfile } from "@/utils/current-profile";
import { MAX_PLAYER_COUNT, createDefaultPlayers, createGame } from "@/utils/functions";
import { rules } from "@/utils/rules";

import classes from "./NewGame.module.css";

import type { RuleNames } from "@/utils/types";

/**
 * URLパラメータに応じてゲームを作成し、適切な画面へ遷移するコンポーネント。
 * 親レイアウトが force-static のため searchParams をサーバーで取得できず、useSearchParams を用いる。
 */
const NewGame: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const rule = searchParams.get("rule");
      const playersParam = searchParams.get("players");
      // players は 0 以上 MAX_PLAYER_COUNT 以下の整数のみ有効
      const playerCount =
        playersParam !== null &&
        /^\d+$/.test(playersParam) &&
        Number(playersParam) <= MAX_PLAYER_COUNT
          ? Number(playersParam)
          : null;

      if (!rule || !Object.prototype.hasOwnProperty.call(rules, rule)) {
        notifications.show({
          title: "ゲームを作成できませんでした",
          message: "指定された形式が見つかりませんでした。",
          color: "red",
        });
        router.replace("/rules");
        return;
      }

      const currentProfile = getStoredCurrentProfile();
      // rule は rules に存在することを確認済み
      const game_id = await createGame(rule as RuleNames, currentProfile);
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
