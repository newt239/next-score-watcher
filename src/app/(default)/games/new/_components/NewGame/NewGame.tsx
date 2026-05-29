"use client";

import { useEffect, useRef } from "react";

import { Center, Loader, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

import { getStoredCurrentProfile } from "@/utils/current-profile";
import { createGame, createPresetPlayers } from "@/utils/functions";
import { rules } from "@/utils/rules";

import classes from "./NewGame.module.css";

import type { RuleNames } from "@/utils/types";

/**
 * 与えられた文字列が有効なゲーム形式名かどうかを判定する型ガード。
 * @param value 判定対象の文字列
 * @returns rules に存在する形式名であれば true
 */
const isValidRule = (value: string): value is RuleNames =>
  Object.prototype.hasOwnProperty.call(rules, value);

/**
 * URLパラメータに応じてゲームを自動作成し、適切な画面へ遷移するコンポーネント。
 * rule で指定された形式のゲームを作成し、preset=default の場合はデフォルト名の
 * プレイヤーも作成して board 画面へ直行する。それ以外は config 画面へ遷移する。
 * 親レイアウトが force-static のため searchParams はサーバーで取得できず、
 * クライアントで window.location.search を直接読む。
 */
const NewGame: React.FC = () => {
  const router = useRouter();
  // マウント時の自動作成を一度だけ実行するためのガード（dev/StrictMode の二重実行対策）
  const hasRun = useRef(false);

  // データ取得ではなく「マウント時に1回だけゲームを作成して遷移する」副作用のため useEffect を使用する
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const rule = params.get("rule");
      const preset = params.get("preset");

      if (!rule || !isValidRule(rule)) {
        notifications.show({
          title: "ゲームを作成できませんでした",
          message: "指定された形式が見つかりませんでした。",
          color: "red",
        });
        router.replace("/rules");
        return;
      }

      const currentProfile = getStoredCurrentProfile();
      const game_id = await createGame(rule, currentProfile);
      if (!game_id) {
        notifications.show({
          title: "ゲームを作成できませんでした",
          message: "もう一度お試しください。",
          color: "red",
        });
        router.replace("/rules");
        return;
      }

      if (preset === "default") {
        await createPresetPlayers(game_id, rule, currentProfile);
        router.replace(`/games/${game_id}/board`);
      } else {
        router.replace(`/games/${game_id}/config`);
      }
    };

    run();
  }, [router]);

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
