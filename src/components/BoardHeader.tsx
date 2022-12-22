import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { Button, Dropdown, Header, Menu } from "semantic-ui-react";

import db, { QuizDBProps } from "#/utils/db";
import { rules } from "#/utils/state";

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
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  useEffect(() => {
    const getQuizList = async () => {
      if (game?.quizset_name) {
        setQuizList(
          await db.quizes.where({ set_name: game.quizset_name }).toArray()
        );
      }
    };
    getQuizList();
  }, [game]);
  if (!game || !players || !logs) {
    return null;
  }
  return (
    <Menu
      style={{
        alignItems: "center",
        height: "15vh",
      }}
    >
      <Menu.Menu
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          height: "100%",
        }}
      >
        <Header as="h2" style={{ margin: 0, fontSize: "2rem" }}>
          {game.name}
        </Header>
        <p>{rules[game.rule].name}</p>
      </Menu.Menu>
      <Menu.Menu
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        第
        <span style={{ fontSize: "2rem", fontWeight: 800 }}>
          {logs.length + 1}
        </span>
        問
      </Menu.Menu>
      <Menu.Menu
        style={{
          flexGrow: 1,
          padding: "1rem",
          height: "100%",
        }}
      >
        {game.quizset_name &&
          quizList.length >= logs.length + game.quizset_offset &&
          logs.length !== 0 && (
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden",
              }}
            >
              <div>{quizList[game.quizset_offset + logs.length - 1].q}</div>
              <div style={{ textAlign: "right", color: "red" }}>
                {quizList[game.quizset_offset + logs.length - 1].a}
              </div>
            </div>
          )}
      </Menu.Menu>
      <Menu.Menu position="right" style={{ height: "100%" }}>
        <Dropdown item icon="configure" simple style={{ flexGrow: 1 }}>
          <Dropdown.Menu direction="left">
            <Dropdown.Item
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: Number(game_id),
                    player_id: -1,
                    variant: "through",
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              スルー
            </Dropdown.Item>
            <Dropdown.Item
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
            </Dropdown.Item>
            <Dropdown.Item onClick={() => router.push(`/${game.id}/config`)}>
              設定
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
};

export default BoardHeader;
