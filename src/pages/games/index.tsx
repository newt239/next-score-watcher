import { useState } from "react";

import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import { Card, Select } from "@chakra-ui/react";
import { css } from "@panda/css";
import ButtonLink from "~/components/custom/ButtonLink";
import Link from "~/components/custom/Link";
import db from "~/utils/db";
import { getRuleStringByType } from "~/utils/rules";

const GamesPage: React.FC = () => {
  const games = useLiveQuery(
    () => db.games.orderBy("last_open").reverse().toArray(),
    []
  );
  const logs = useLiveQuery(() => db.logs.toArray(), []);
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");

  const parsedGameList = (games || [])
    .sort((prev, cur) => {
      if (orderType === "last_open") {
        if (prev.last_open > cur.last_open) return -1;
        if (prev.last_open < cur.last_open) return 1;
        return 0;
      } else {
        if (prev.name < cur.name) return -1;
        if (prev.name > cur.name) return 1;
        return 0;
      }
    })
    .map((game) => {
      const eachGameLogs = (logs || []).filter(
        (log) => log.game_id === game.id
      );
      const gameState =
        eachGameLogs.length === 0 ? "設定中" : `${eachGameLogs.length}問目`;
      return {
        id: game.id,
        name: game.name,
        type: getRuleStringByType(game),
        player_count: game.players.length,
        state: gameState,
        last_open: game.last_open,
      };
    });

  return (
    <div>
      <h2>作成したゲーム</h2>
      <div
        className={css({
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
        })}
      >
        <Select
          width="auto"
          onChange={(v) => setOrderType(v.target.value as "last_open" | "name")}
        >
          <option value="last_open">最終閲覧順</option>
          <option value="name">ゲーム名順</option>
        </Select>
      </div>
      {parsedGameList.length === 0 ? (
        <p>
          作成済みのゲームはありません。
          <Link href="/option">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : (
        <div
          className={css({
            display: "grid",
            gap: 3,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            pt: 3,
          })}
        >
          {parsedGameList.map((game) => (
            <Card
              className={css({
                display: "grid",
                justifyContent: "space-between",
                gap: "12px",
                p: "12px",
              })}
              variant="filled"
              key={game.id}
              title={game.name}
            >
              <div>
                <h3 style={{ whiteSpace: "nowrap", overflowX: "scroll" }}>
                  {game.name}
                </h3>
                <p>
                  {game.type} ／ {game.player_count}人
                </p>
                <p>進行状況: {game.state}</p>
              </div>
              <div
                className={css({
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                })}
              >
                <div>{cdate(game.last_open).format("MM/DD HH:mm")}</div>
                <ButtonLink
                  href={`/games/${game.id}/config`}
                  leftIcon={<AdjustmentsHorizontal />}
                  size="sm"
                  colorScheme="green"
                >
                  開く
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesPage;
