"use client";

import { Box, Button, Flex } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

import classes from "./GameStartButton.module.css";

import type { GamePropsUnion, LogDBProps } from "@/utils/types";

import ButtonLink from "@/components/ButtonLink";

type Props = {
  game: GamePropsUnion;
  logs: LogDBProps[];
  disabled: boolean;
};

const GameStartButton: React.FC<Props> = ({ game, logs, disabled }) => {
  const errorMessages = [];
  if (game.players.length === 0)
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  if (game.players.length > 14)
    errorMessages.push("プレイヤー人数は14人以内で設定してください。");
  if (game.win_through && game.players.length <= game.win_through)
    errorMessages.push(
      "「勝ち抜け人数」はプレイヤーの人数より少なくしてください。"
    );
  if (disabled)
    errorMessages.push(
      `現在${
        logs.length + 1
      }問目です。ゲームが開始済みであるため、一部の設定を変更するとプレイログが削除されることがあります。`
    );
  if (game.rule === "aql" && game.players.length !== 10)
    errorMessages.push("AQLは10人でプレイする必要があります。");

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
            href={`/games/${game.id}/board`}
            leftSection={<IconPlayerPlay />}
            miw={200}
          >
            ゲーム開始
          </ButtonLink>
        )}
      </Flex>
    </Box>
  );
};

export default GameStartButton;
