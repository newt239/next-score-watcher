"use client";

import { Accordion, Box, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconUpload } from "@tabler/icons-react";

import CompactCreatePlayer from "../CompactCreatePlayer";
import CompactPlayerTable from "../CompactPlayerTable";
import SelectPlayerFromExistingGame from "../SelectPlayerFromExistingGame/SelectPlayerFromExistingGame";

import classes from "./SelectPlayer.module.css";

import type { GamePlayerProps, PlayerProps } from "@/models/game";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";

type SelectPlayerProps = {
  game_id: string;
  players: PlayerProps[];
  gamePlayers: GamePlayerProps[];
  disabled?: boolean;
  onPlayersChange?: (newGamePlayerIds: string[]) => void;
};

/**
 * オンライン版プレイヤー選択コンポーネント
 * プレイヤーの追加、データベースからの選択、ゲームからのコピー機能を提供
 */
const SelectPlayer: React.FC<SelectPlayerProps> = ({
  game_id,
  players,
  gamePlayers,
  disabled = false,
  onPlayersChange,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {players.length === 0 ? (
        <ButtonLink
          leftSection={<IconUpload />}
          mt={3}
          href={`/online/players?from=online/games/${game_id}`}
          size="md"
          color="blue"
          disabled={disabled}
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
            disabled={disabled}
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
                    game_id={game_id}
                    playerCount={gamePlayers.length}
                  />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="select">
                <Accordion.Control>データベースから追加</Accordion.Control>
                <Accordion.Panel pb={4}>
                  {players.length === 0 ? (
                    <Box py={3}>
                      <Link href="/online/players">プレイヤー管理</Link>
                      ページから一括でプレイヤー情報を登録できます。
                    </Box>
                  ) : (
                    <CompactPlayerTable
                      gamePlayerIds={gamePlayers.map((p) => p.id)}
                      game_id={game_id}
                      players={players}
                      onPlayersChange={onPlayersChange}
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
