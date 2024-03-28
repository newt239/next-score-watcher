import { useNavigate } from "react-router-dom";

import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDown } from "tabler-icons-react";

import { createGame } from "~/utils/functions";
import { recordEvent } from "~/utils/ga4";
import { GamePropsUnion } from "~/utils/types";

type CopyGamePropsUnion = {
  game: GamePropsUnion;
};

const CopyGame: React.FC<CopyGamePropsUnion> = ({ game }) => {
  const navigate = useNavigate();

  const onCompleteCopy = (game_id: string) => {
    recordEvent({
      action: "copy_game",
      category: "engagement",
      label: game.rule,
    });
    navigate(`/games/${game_id}/config`);
    navigate(0);
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
