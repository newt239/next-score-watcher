"use client";

import { Accordion, Box, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconUpload } from "@tabler/icons-react";

import CompactCreatePlayer from "../CompactCreatePlayer";
import CompactPlayerTable from "../CompactPlayerTable";
import SelectPlayerFromExistingGame from "../SelectPlayerFromExistingGame";

import classes from "./SelectPlayer.module.css";

import type { GameDBPlayerProps, PlayerDBProps } from "@/utils/types";
import type { UseFormReturnType } from "@mantine/form";

import ButtonLink from "@/components/ButtonLink";
import Link from "@/components/Link";

type Props = {
  game_id: string;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  currentProfile: string;
  form: UseFormReturnType<
    {
      players: GameDBPlayerProps[];
    },
    (values: { players: GameDBPlayerProps[] }) => {
      players: GameDBPlayerProps[];
    }
  >;
};

const SelectPlayer: React.FC<Props> = ({
  game_id,
  playerList,
  players,
  currentProfile,
  form,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {playerList.length === 0 ? (
        <ButtonLink
          leftSection={<IconUpload />}
          mt={3}
          href={`/players?from=${game_id}`}
          size="md"
          color="blue"
        >
          プレイヤーを読み込む
        </ButtonLink>
      ) : (
        <>
          <Button
            leftSection={<IconPlus />}
            className={classes.open_drawer_button}
            onClick={open}
            size="md"
            color="blue"
          >
            プレイヤーを選択
          </Button>
          <Drawer
            opened={opened}
            onClose={close}
            position="right"
            title="プレイヤー選択"
            offset={10}
            radius="md"
          >
            <Accordion defaultValue="select">
              <Accordion.Item value="add">
                <Accordion.Control>新しく追加</Accordion.Control>
                <Accordion.Panel pb={4}>
                  <CompactCreatePlayer
                    currentProfile={currentProfile}
                    game_id={game_id}
                    players={players}
                  />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="select">
                <Accordion.Control>データベースから追加</Accordion.Control>
                <Accordion.Panel pb={4}>
                  {playerList.length === 0 ? (
                    <Box py={3}>
                      <Link href="/players">プレイヤー管理</Link>
                      ページから一括でプレイヤー情報を登録できます。
                    </Box>
                  ) : (
                    <CompactPlayerTable
                      currentProfile={currentProfile}
                      gamePlayers={players}
                      game_id={game_id}
                      playerList={playerList}
                      form={form}
                    />
                  )}
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="copy">
                <Accordion.Control>既存のゲームからコピー</Accordion.Control>
                <Accordion.Panel pb={4}>
                  <SelectPlayerFromExistingGame
                    currentProfile={currentProfile}
                    game_id={game_id}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Drawer>
        </>
      )}
    </>
  );
};

export default SelectPlayer;
