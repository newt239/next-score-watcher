import { useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { Plus, Upload } from "tabler-icons-react";

import Anchor from "#/components/Anchor";
import ButtonLink from "#/components/ButtonLink";
import CompactCreatePlayer from "#/features/config/CompactCreatePlayer";
import CompactPlayerTable from "#/features/config/CompactPlayerTable";
import { GameDBPlayerProps, PlayerDBProps } from "#/utils/types";

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
        <ButtonLink href={`/player?from=${game_id}`} leftIcon={<Upload />}>
          プレイヤーデータを読み込む
        </ButtonLink>
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
                      <div>新しく追加</div>
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
                      <div>データベースから追加</div>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {playerList.length === 0 ? (
                        <div>
                          <Anchor href="/player">プレイヤー管理</Anchor>
                          ページから一括でプレイヤー情報を登録できます。
                        </div>
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
