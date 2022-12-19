import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { Button, Header, Menu } from "semantic-ui-react";

import db from "#/utils/db";
import state from "#/utils/state";

const BoardHeader: React.FC = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  if (!game || !players || !logs) {
    return null;
  }
  return (
    <Menu>
      <Menu.Item
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Header as="h2">{game.name}</Header>
        <p>{state.rules[game.rule].name}</p>
      </Menu.Item>
      <Menu.Item style={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
        <div style={{ padding: 2, minWidth: 50 }}>Q {logs.length + 1}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 2,
            borderColor: "green.500",
            borderLeftWidth: 2,
          }}
        >
          <div>問題文</div>
          <div>答え</div>
        </div>
      </Menu.Item>
      <Menu.Item>
        <Button.Group>
          <Button
            primary
            disabled={logs.length === 0}
            onClick={async () => {
              try {
                await db.logs.delete(Number(logs[logs.length - 1].id));
              } catch (err) {
                console.log(err);
              }
            }}
          >
            一つ戻す
          </Button>
          <Button onClick={() => router.push(`/${game.id}/config`)}>
            設定
          </Button>
        </Button.Group>
      </Menu.Item>
    </Menu>
  );
};

export default BoardHeader;
