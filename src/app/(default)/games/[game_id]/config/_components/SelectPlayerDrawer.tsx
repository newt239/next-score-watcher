"use client";

import { Plus, Upload } from "tabler-icons-react";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";
import { GameDBPlayerProps, PlayerDBProps } from "@/utils/types";
import { Accordion, Box, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  game_id: string;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
};

const SelectPlayerDrawer: React.FC<Props> = ({
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
        >
          プレイヤーデータを読み込む
        </ButtonLink>
      ) : (
        <>
          <Button
            disabled={disabled}
            leftSection={<Plus />}
            mt={3}
            onClick={open}
          >
            プレイヤーを選択
          </Button>
          <Drawer
            opened={opened}
            onClose={close}
            position="right"
            title="プレイヤー選択"
            offset={2}
            radius="md"
          >
            <Accordion>
              <Accordion.Item value="add">
                <Accordion.Control>新しく追加</Accordion.Control>
                <Accordion.Panel pb={4}>
                  <CompactCreatePlayer game_id={game_id} players={players} />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="">
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

export default SelectPlayerDrawer;
