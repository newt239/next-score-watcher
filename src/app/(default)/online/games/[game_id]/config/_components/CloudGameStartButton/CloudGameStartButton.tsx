"use client";

import { Flex } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

import classes from "./CloudGameStartButton.module.css";

import ButtonLink from "@/app/_components/ButtonLink";

type Game = {
  id: string;
  name?: string;
};

type Props = {
  game: Game;
  logs: unknown[];
};

const CloudGameStartButton: React.FC<Props> = ({ game, logs }) => {
  return (
    <Flex className={classes.game_start_button}>
      <ButtonLink
        href={`../../../(board)/online/games/${game.id}/board`}
        leftSection={<IconPlayerPlay />}
        size="lg"
        flex={1}
      >
        {logs.length === 0 ? "ゲーム開始" : "ボードを開く"}
      </ButtonLink>
    </Flex>
  );
};

export default CloudGameStartButton;
