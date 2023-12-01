"use client";

import { useRouter } from "next/navigation";

import { ChevronDown } from "tabler-icons-react";

import Menu, { MenuItem } from "#/app/_components/Menu";
import { createGame } from "#/utils/functions";
import { GameDBProps } from "#/utils/types";

type CopyGamePropsUnion = {
  game: GameDBProps;
};

const CopyGame: React.FC<CopyGamePropsUnion> = ({ game }) => {
  const router = useRouter();

  const onCompleteCopy = (game_id: string) => {
    router.push(`/${game_id}/config`);
  };

  return (
    <Menu
      label={
        <>
          <ChevronDown />
          コピーする
        </>
      }
    >
      <MenuItem
        onClick={async () => {
          const game_id = await createGame({
            game,
            action_type: "copy-rule",
          });
          onCompleteCopy(game_id as string);
        }}
      >
        形式設定のみコピー
      </MenuItem>
      <MenuItem
        onClick={async () => {
          const game_id = await createGame({ game, action_type: "copy-all" });
          onCompleteCopy(game_id as string);
        }}
      >
        すべてコピー
      </MenuItem>
    </Menu>
  );
};

export default CopyGame;
