"use client";

import { useEffect, useState } from "react";

import { Box, Button, Flex } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

import classes from "./GameStartButton.module.css";

import type { GameDBPlayerProps, RuleNames } from "@/utils/types";

import ButtonLink from "@/app/_components/ButtonLink";
import createApiClient from "@/utils/hono/client";

type Props = {
  logs: unknown[];
};

type Game = {
  id: string;
  name: string;
  ruleType: RuleNames;
  createdAt: string;
  updatedAt: string;
  discordWebhookUrl?: string | null;
  players?: GameDBPlayerProps[];
  settings?: Record<string, unknown>;
};

const GameStartButton: React.FC<Props> = ({ logs }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameId = window.location.pathname.split("/")[4];
        const apiClient = createApiClient();
        const response = await apiClient["games"][":gameId"].$get({
          param: { gameId },
        });

        if (response.ok) {
          const data = await response.json();
          if ("game" in data) {
            setGame(data.game);
          }
        }
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  if (loading || !game) {
    return null;
  }

  const errorMessages = [];
  if (!game.players || game.players.length === 0) {
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  }
  if (game.players && game.players.length > 14) {
    errorMessages.push("プレイヤー人数は14人以内で設定してください。");
  }

  // ゲーム設定から勝ち抜け人数を取得
  const winThrough = game.settings?.win_through as number | undefined;
  if (winThrough && game.players && game.players.length <= winThrough) {
    errorMessages.push(
      "「勝ち抜け人数」はプレイヤーの人数より少なくしてください。"
    );
  }

  if (logs.length > 0) {
    errorMessages.push(
      `現在${
        logs.length + 1
      }問目です。ゲームが開始済みであるため、一部の設定を変更するとプレイログが削除されることがあります。`
    );
  }

  if (game.ruleType === "aql" && game.players && game.players.length !== 10) {
    errorMessages.push("AQLは10人でプレイする必要があります。");
  }

  const playButtonIsDisabled =
    errorMessages.filter((t) => t.indexOf("ゲームが開始済み") === -1).length !==
    0;

  return (
    <Box
      className={classes.game_start_container}
      data-disabled={playButtonIsDisabled}
    >
      <Flex className={classes.game_start_wrapper}>
        <Box className={classes.error_message}>
          {errorMessages.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </Box>
        {playButtonIsDisabled ? (
          <Button
            disabled={playButtonIsDisabled}
            leftSection={<IconPlayerPlay />}
            size="xl"
            miw={200}
          >
            ゲーム開始
          </Button>
        ) : (
          <ButtonLink
            size="xl"
            variant="gradient"
            gradient={{ from: "teal", to: "lime", deg: 135 }}
            href="./board"
            leftSection={<IconPlayerPlay />}
            miw={200}
          >
            {logs.length === 0 ? "ゲーム開始" : "ボードを開く"}
          </ButtonLink>
        )}
      </Flex>
    </Box>
  );
};

export default GameStartButton;
