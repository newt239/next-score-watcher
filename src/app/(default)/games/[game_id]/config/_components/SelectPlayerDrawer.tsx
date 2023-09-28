"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Link as ChakraLink,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { Plus, Upload } from "tabler-icons-react";

import CompactCreatePlayer from "#/app/(default)/games/[game_id]/config/_components/CompactCreatePlayer";
import CompactPlayerTable from "#/app/(default)/games/[game_id]/config/_components/CompactPlayerTable";
import ButtonLink from "#/app/_components/ButtonLink";
import { GamePlayersDB, PlayersDB } from "#/utils/types";

type SelectPlayerDrawerProps = {
  game_id: string;
  playerList: GamePlayersDB["Insert"][];
  players: PlayersDB["Insert"][];
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
        <ButtonLink href={`/players?from=${game_id}`} leftIcon={<Upload />}>
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
                          <ChakraLink as={Link} color="blue.500" href="/player">
                            プレイヤー管理
                          </ChakraLink>
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
