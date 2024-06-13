import { useRouter } from "next/navigation";

import { Button, Title } from "@mantine/core";

import { createGame } from "@/utils/functions";
import { GamePropsUnion } from "@/utils/types";

type CopyGamePropsUnion = {
  game: GamePropsUnion;
};

const CopyGame: React.FC<CopyGamePropsUnion> = ({ game }) => {
  const router = useRouter();

  const onCompleteCopy = (game_id: string) => {
    router.push(`/games/${game_id}/config`);
  };

  return (
    <>
      <Title order={4}>コピーを作成</Title>
      <Button.Group>
        <Button
          onClick={async () => {
            const game_id = await createGame({
              game,
              action_type: "copy-rule",
            });
            onCompleteCopy(game_id as string);
          }}
        >
          形式設定のみコピー
        </Button>
        <Button
          onClick={async () => {
            const game_id = await createGame({ game, action_type: "copy-all" });
            onCompleteCopy(game_id as string);
          }}
        >
          すべてコピー
        </Button>
      </Button.Group>
    </>
  );
};

export default CopyGame;
