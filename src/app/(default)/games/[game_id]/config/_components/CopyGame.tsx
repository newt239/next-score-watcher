"use client";

import { useRouter } from "next/navigation";

import { Box, Button, Title } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";

import { createGame } from "@/utils/functions";
import { GamePropsUnion } from "@/utils/types";

type CopyGamePropsUnion = {
  game: GamePropsUnion;
  currentProfile: string;
};

const CopyGame: React.FC<CopyGamePropsUnion> = ({ game, currentProfile }) => {
  const router = useRouter();

  const onCompleteCopy = (game_id: string) => {
    sendGAEvent({
      event: "copy_game",
      value: game.rule,
    });
    router.push(`/games/${game_id}/config`);
  };

  return (
    <Box mt="sm">
      <Title order={4}>コピーを作成</Title>
      <Button.Group mt="sm">
        <Button
          onClick={async () => {
            const game_id = await createGame(
              {
                game,
                action_type: "copy-rule",
              },
              currentProfile
            );
            onCompleteCopy(game_id as string);
          }}
        >
          形式設定のみコピー
        </Button>
        <Button
          onClick={async () => {
            const game_id = await createGame(
              { game, action_type: "copy-all" },
              currentProfile
            );
            onCompleteCopy(game_id as string);
          }}
        >
          すべてコピー
        </Button>
      </Button.Group>
    </Box>
  );
};

export default CopyGame;
