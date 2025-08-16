"use client";

import { Group, Table } from "@mantine/core";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { cdate } from "cdate";

import PublicityBadge from "../PublicityBadge/PublicityBadge";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";

type GameListTableProps = {
  gameList: {
    id: string;
    name: string;
    ruleType: string;
    playerCount: number;
    logCount: number;
    updatedAt: string;
    isPublic: boolean;
  }[];
};

const GameListTable: React.FC<GameListTableProps> = ({ gameList }) => {
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
                <Table.Th>公開状態</Table.Th>
                <Table.Th>最終更新日時</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {gameList.map((game) => (
                <Table.Tr key={game.id}>
                  <Table.Td>{game.name}</Table.Td>
                  <Table.Td>{game.ruleType}</Table.Td>
                  <Table.Td>{game.playerCount}人</Table.Td>
                  <Table.Td>{game.logCount}問目</Table.Td>
                  <Table.Td>
                    <PublicityBadge isPublic={game.isPublic} size="lg" />
                  </Table.Td>
                  <Table.Td>
                    {cdate(game.updatedAt).format("MM/DD HH:mm")}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ButtonLink
                        href={`/online/games/${game.id}/config`}
                        leftSection={<IconAdjustmentsHorizontal />}
                        size="sm"
                      >
                        開く
                      </ButtonLink>
                    </Group>
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
