"use client";

import { useRouter } from "next/navigation";

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { ChevronDown } from "tabler-icons-react";

import { createGame } from "#/utils/functions";
import { GamesDB } from "#/utils/types";

type CopyGamePropsUnion = {
  game: GamesDB["Insert"];
};

const CopyGame: React.FC<CopyGamePropsUnion> = ({ game }) => {
  const router = useRouter();

  const onCompleteCopy = (game_id: string) => {
    router.push(`/${game_id}/config`);
  };

  return (
    <Menu
      menuButton={
        <MenuButton>
          <ChevronDown />
          コピーする
        </MenuButton>
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
