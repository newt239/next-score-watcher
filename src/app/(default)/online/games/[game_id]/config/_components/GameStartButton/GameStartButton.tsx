"use client";

import { Flex } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

import classes from "./GameStartButton.module.css";

import ButtonLink from "@/app/_components/ButtonLink";

type Props = {
  logs: unknown[];
};

const GameStartButton: React.FC<Props> = ({ logs }) => {
  return (
    <Flex className={classes.game_start_button}>
      <ButtonLink
        href="./board"
        leftSection={<IconPlayerPlay />}
        size="lg"
        flex={1}
      >
        {logs.length === 0 ? "ゲーム開始" : "ボードを開く"}
      </ButtonLink>
    </Flex>
  );
};

export default GameStartButton;
