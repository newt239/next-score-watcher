import { useState } from "react";
import { Link as ReactLink } from "react-router-dom";

import { Button, Card, Link, Select, SimpleGrid, Text } from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import db from "#/utils/db";
import { getRuleStringByType } from "#/utils/rules";
import { css } from "@panda/css";

const GameList: React.FC = () => {
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
      <div
        className={css({
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <h2>作成したゲーム</h2>
        <Select
          defaultValue={orderType}
          onChange={(v) => setOrderType(v.target.value as "last_open" | "name")}
          width={200}
        >
          <option value="last_open">最終閲覧順</option>
          <option value="name">ゲーム名順</option>
        </Select>
      </div>
      {parsedGameList.length === 0 ? (
        <Text px={5} py={10}>
          作成済みのゲームはありません。
          <Link as={ReactLink} color="blue.500" to="/option">
            形式一覧
          </Link>
          ページから新しいゲームを作ることが出来ます。
        </Text>
      ) : (
        <SimpleGrid
          pt={3}
          spacing={3}
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        >
          {parsedGameList.map((game) => (
            <Card
              gap={3}
              justifyContent="space-between"
              key={game.id}
              p={3}
              variant="filled"
            >
              <div>
                <h3 style={{ whiteSpace: "nowrap", overflowX: "scroll" }}>
                  {game.name}
                </h3>
                <Text>
                  {game.type} ／ {game.player_count}人
                </Text>
                <Text>進行状況: {game.state}</Text>
              </div>
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                })}
              >
                <div className={css({ fontSize: "70%", opacity: 0.5 })}>
                  {cdate(game.last_open).format("MM/DD HH:mm")}
                </div>
                <Button
                  as={ReactLink}
                  colorScheme="green"
                  leftIcon={<AdjustmentsHorizontal />}
                  size="sm"
                  to={`/${game.id}/config`}
                >
                  開く
                </Button>
              </div>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
};

export default GameList;
