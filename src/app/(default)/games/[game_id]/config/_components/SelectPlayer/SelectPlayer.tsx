"use client";

import { Accordion, Box, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Plus, Upload } from "tabler-icons-react";

import CompactCreatePlayer from "../CompactCreatePlayer";
import CompactPlayerTable from "../CompactPlayerTable";
import SelectPlayerFromExistingGame from "../SelectPlayerFromExistingGame";

import classes from "./SelectPlayer.module.css";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";
import { GameDBPlayerProps, PlayerDBProps } from "@/utils/types";

type Props = {
  game_id: string;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
};

const SelectPlayer: React.FC<Props> = ({
  game_id,
  playerList,
  players,
  disabled,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {playerList.length === 0 ? (
        <ButtonLink
          leftSection={<Upload />}
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
            disabled={disabled}
            leftSection={<Plus />}
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
            <Accordion defaultValue="add">
              <Accordion.Item value="add">
                <Accordion.Control>新しく追加</Accordion.Control>
                <Accordion.Panel pb={4}>
                  <CompactCreatePlayer game_id={game_id} players={players} />
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
                      gamePlayers={players}
                      game_id={game_id}
                      playerList={playerList}
                    />
                  )}
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="copy">
                <Accordion.Control>既存のゲームからコピー</Accordion.Control>
                <Accordion.Panel pb={4}>
                  <SelectPlayerFromExistingGame game_id={game_id} />
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
