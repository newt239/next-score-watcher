import {
  Group,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { cdate } from "cdate";

import PublicityBadge from "../PublicityBadge/PublicityBadge";

import ButtonLink from "@/components/ButtonLink";
import Link from "@/components/Link";

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
        <TableScrollContainer minWidth={500}>
          <Table highlightOnHover>
            <TableThead>
              <TableTr>
                <TableTh>ゲーム名</TableTh>
                <TableTh>形式</TableTh>
                <TableTh>プレイヤー数</TableTh>
                <TableTh>進行状況</TableTh>
                <TableTh>公開状態</TableTh>
                <TableTh>最終更新日時</TableTh>
                <TableTh></TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>
              {gameList.map((game) => (
                <TableTr key={game.id}>
                  <TableTd>{game.name}</TableTd>
                  <TableTd>{game.ruleType}</TableTd>
                  <TableTd>{game.playerCount}人</TableTd>
                  <TableTd>{game.logCount}問目</TableTd>
                  <TableTd>
                    <PublicityBadge isPublic={game.isPublic} size="lg" />
                  </TableTd>
                  <TableTd>
                    {cdate(game.updatedAt).format("MM/DD HH:mm")}
                  </TableTd>
                  <TableTd>
                    <Group gap="xs">
                      <ButtonLink
                        href={`/online/games/${game.id}/config`}
                        leftSection={<IconAdjustmentsHorizontal />}
                        size="sm"
                      >
                        開く
                      </ButtonLink>
                    </Group>
                  </TableTd>
                </TableTr>
              ))}
            </TableTbody>
          </Table>
        </TableScrollContainer>
      )}
    </>
  );
};

export default GameListTable;
