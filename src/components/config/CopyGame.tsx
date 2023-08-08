import { useNavigate } from "react-router-dom";

import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDown } from "tabler-icons-react";

import { createGame } from "#/utils/functions";
import { GameDBProps } from "#/utils/types";

type CopyGameProps = {
  game: GameDBProps;
};

const CopyGame: React.FC<CopyGameProps> = ({ game }) => {
  const navigate = useNavigate();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDown />}>
        コピーする
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={async () => {
            const game_id = await createGame({
              game,
              action_type: "copy-rule",
            });
            await navigate(`/${game_id}/config`);
            await navigate(0);
          }}
        >
          形式設定のみコピー
        </MenuItem>
        <MenuItem
          onClick={async () => {
            const game_id = await createGame({ game, action_type: "copy-all" });
            await navigate(`/${game_id}/config`);
            await navigate(0);
          }}
        >
          すべてコピー
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default CopyGame;
