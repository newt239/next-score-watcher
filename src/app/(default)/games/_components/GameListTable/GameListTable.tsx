"use client";

import { Table } from "@mantine/core";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { cdate } from "cdate";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";

type Props = {
  gameList: {
    id: string;
    name: string;
    type: string;
    player_count: number;
    state: string;
    last_open: string;
  }[];
};

const GameListTable: React.FC<Props> = ({ gameList }) => {
  return (
    <>
      {gameList.length === 0 ? (
        <p>
          作成済みのゲームはありません。
          <Link href="/rules">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : (
        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ゲーム名</Table.Th>
                <Table.Th>形式</Table.Th>
                <Table.Th>プレイヤー数</Table.Th>
                <Table.Th>進行状況</Table.Th>
                <Table.Th>最終操作日時</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {gameList.map((game) => (
                <Table.Tr key={game.id}>
                  <Table.Td>{game.name}</Table.Td>
                  <Table.Td>{game.type}</Table.Td>
                  <Table.Td>{game.player_count}人</Table.Td>
                  <Table.Td>{game.state}</Table.Td>
                  <Table.Td>
                    {cdate(game.last_open).format("MM/DD HH:mm")}
                  </Table.Td>
                  <Table.Td>
                    <ButtonLink
                      href={`/games/${game.id}/config`}
                      leftSection={<IconAdjustmentsHorizontal />}
                      size="sm"
                    >
                      開く
                    </ButtonLink>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </>
  );
};

export default GameListTable;
