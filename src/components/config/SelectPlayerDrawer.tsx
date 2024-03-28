import { useState } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
} from "@chakra-ui/react";
import { Plus, Upload } from "tabler-icons-react";

import CompactCreatePlayer from "~/components/config/CompactCreatePlayer";
import CompactPlayerTable from "~/components/config/CompactPlayerTable";
import { GameDBPlayerProps, PlayerDBProps } from "~/utils/types";

type SelectPlayerDrawerProps = {
  game_id: string;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
};

const SelectPlayerDrawer: React.FC<SelectPlayerDrawerProps> = ({
  game_id,
  playerList,
  players,
  disabled,
}) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      {playerList.length === 0 ? (
        <Button
          as={ReactLink}
          colorScheme="blue"
          leftIcon={<Upload />}
          mt={3}
          to={`/player?from=${game_id}`}
        >
          プレイヤーデータを読み込む
        </Button>
      ) : (
        <>
          <Button
            colorScheme="blue"
            isDisabled={disabled}
            leftIcon={<Plus />}
            mt={3}
            onClick={() => setDrawerOpen(true)}
          >
            プレイヤーを選択
          </Button>
          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="right"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>プレイヤー選択</DrawerHeader>
              <DrawerBody p={0}>
                <Accordion defaultIndex={1}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        新しく追加
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <CompactCreatePlayer
                        game_id={game_id}
                        players={players}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        データベースから追加
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {playerList.length === 0 ? (
                        <Box py={3}>
                          <Link as={ReactLink} color="blue.500" to="/player">
                            プレイヤー管理
                          </Link>
                          ページから一括でプレイヤー情報を登録できます。
                        </Box>
                      ) : (
                        <CompactPlayerTable
                          gamePlayers={players}
                          game_id={game_id}
                          playerList={playerList}
                        />
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
};

export default SelectPlayerDrawer;
