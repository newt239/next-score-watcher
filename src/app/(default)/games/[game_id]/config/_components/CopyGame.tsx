import { useRouter } from "next/navigation";

import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDown } from "tabler-icons-react";

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
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDown />}>
        コピーする
      </MenuButton>
      <MenuList minW="auto">
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
      </MenuList>
    </Menu>
  );
};

export default CopyGame;
