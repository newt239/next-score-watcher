"use client";

import { Box, Button, Flex, List } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { PlayerPlay } from "tabler-icons-react";

import classes from "./GameStartButton.module.css";

import ButtonLink from "@/app/_components/ButtonLink";
import { GamePropsUnion, LogDBProps } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  logs: LogDBProps[];
  disabled: boolean;
};

const GameStartButton: React.FC<Props> = ({ game, logs, disabled }) => {
  const { width } = useViewportSize();

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
      }問目です。ゲームが開始済みであるため、一部の設定は変更できません。`
    );

  const playButtonIsDisabled =
    errorMessages.filter((t) => t.indexOf("ゲームが開始済み") === -1).length !==
    0;

  return (
    <Box
      className={classes.game_start_container}
      style={{
        borderColor: playButtonIsDisabled
          ? "red.5!important"
          : "white!important",
        _dark: {
          borderColor: playButtonIsDisabled
            ? "red.3!important"
            : "gray.8!important",
        },
      }}
    >
      <Flex className={classes.game_start_wrapper}>
        <List className="text-red-500">
          {errorMessages.map((m) => (
            <List.Item key={m}>{m}</List.Item>
          ))}
        </List>
        {playButtonIsDisabled ? (
          <Button
            disabled={playButtonIsDisabled}
            leftSection={<PlayerPlay />}
            size="md"
          >
            ゲーム開始
          </Button>
        ) : (
          <ButtonLink
            size="md"
            variant="gradient"
            gradient={{ from: "teal", to: "lime", deg: 135 }}
            href={`/games/${game.id}/board`}
            leftSection={<PlayerPlay />}
          >
            ゲーム開始
          </ButtonLink>
        )}
      </Flex>
    </Box>
  );
};

export default GameStartButton;