import { Box, Button, Flex } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

import classes from "./GameStartButton.module.css";

import type { RuleNames } from "@/models/game";

import ButtonLink from "@/app/_components/ButtonLink";

type GameStartButtonProps = {
  ruleType: RuleNames;
  playerCount: number;
  logCount: number;
  winThrough?: number;
  gameId: string;
};

const GameStartButton: React.FC<GameStartButtonProps> = ({
  ruleType,
  playerCount,
  logCount,
  winThrough,
  gameId,
}) => {
  const errorMessages = [];
  if (playerCount === 0) {
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  }
  if (playerCount > 14) {
    errorMessages.push("プレイヤー人数は14人以内で設定してください。");
  }

  // ゲーム設定から勝ち抜け人数を取得
  if (winThrough && playerCount <= winThrough) {
    errorMessages.push(
      "「勝ち抜け人数」はプレイヤーの人数より少なくしてください。"
    );
  }

  if (logCount > 0) {
    errorMessages.push(
      `現在${
        logCount + 1
      }問目です。ゲームが開始済みであるため、一部の設定を変更するとプレイログが削除されることがあります。`
    );
  }

  if (ruleType === "aql" && playerCount !== 10) {
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
            href={`/online/games/${gameId}/board`}
            leftSection={<IconPlayerPlay />}
            miw={200}
          >
            {logCount === 0 ? "ゲーム開始" : "ボードを開く"}
          </ButtonLink>
        )}
      </Flex>
    </Box>
  );
};

export default GameStartButton;
