import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";

import db, { PlayerDBProps } from "#/utils/db";

interface SelectPlayerProps {
  game_id: number;
  playerList: PlayerDBProps[];
  players: number[];
}

const SelectPlayer: React.FC<SelectPlayerProps> = ({
  game_id,
  playerList,
  players,
}) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const onChangeHandler = async (player: PlayerDBProps) => {
    if (players.includes(Number(player.id))) {
      await db.games.update(game_id, {
        players: players.filter((player_id) => player_id != player.id),
      });
    } else {
      await db.games.update(game_id, {
        players: [...players, Number(player.id)],
      });
    }
  };

  return (
    <Box pt={5}>
      <Button onClick={() => setDrawerOpen(true)} size="sm" colorScheme="green">
        選択する
      </Button>
      <Drawer
        isOpen={drawerOpen}
        placement="right"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>プレイヤー選択</DrawerHeader>
          <DrawerBody>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>プレイヤー名</Th>
                    <Th>所属</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {playerList.map((player, i) => (
                    <Tr key={i}>
                      <Td>
                        <Checkbox
                          onChange={() => onChangeHandler(player)}
                          isChecked={players.includes(Number(player.id))}
                        />
                      </Td>
                      <Td>{player.name}</Td>
                      <Td>{player.belong}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <UnorderedList>
        {players.map((player_id) => (
          <ListItem key={player_id}>
            {playerList.find((player) => player.id === player_id)?.name}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default SelectPlayer;
