import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { Button, Container, Form, Message, Select } from "semantic-ui-react";

import ConfigInput from "#/components/ConfigInput";
import ConfigNumberInput from "#/components/ConfigNumberInput";
import PlayerConfigInput from "#/components/PlayerConfigInput";
import db from "#/utils/db";

const Config: NextPage = () => {
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
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));
  const updatePlayerCount = async () => {
    if (game) {
      const players = await db.players
        .where({ game_id: game.id })
        .reverse()
        .toArray();
      if (players.length < game.count) {
        for (let i = players.length + 1; i <= game.count; i++) {
          await db.players.put({
            game_id: Number(game.id),
            name: `プレイヤー${i}`,
            belong: "",
            initial_correct: 0,
            initial_wrong: 0,
          });
        }
      } else {
        players.forEach((player, i) => {
          if (i < players.length - game.count) {
            db.players.delete(Number(player.id)).catch((e) => console.log(e));
          }
        });
      }
    }
  };
  useEffect(() => {
    updatePlayerCount();
  }, [game]);
  if (!game || !players || !logs) {
    return null;
  }
  const deleteGame = () => {
    db.games.delete(Number(game.id)).then(() => router.push("/"));
  };
  return (
    <div>
      <main>
        <Container style={{ padding: "1rem" }}>
          {logs.length === 0 && (
            <Message warning>
              <p>ゲームは開始済みです。設定の変更はできません。</p>
            </Message>
          )}
          <Form>
            <h2>形式設定</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <ConfigInput
                input_id="name"
                label="ゲーム名"
                placehodler="〇〇大会"
              />
              <ConfigNumberInput
                input_id="count"
                label="プレイヤー人数"
                max={5}
              />
              {["nomx"].includes(game.rule) && (
                <>
                  <ConfigNumberInput
                    input_id="win_point"
                    label="勝ち抜け正解数"
                    max={30}
                  />
                  <ConfigNumberInput
                    input_id="lose_point"
                    label="失格誤答数"
                    max={30}
                  />
                </>
              )}
              {["nbyn", "nupdown", "swedishx"].includes(game.rule) && (
                <ConfigNumberInput input_id="win_point" label="N" max={10} />
              )}
              {["nupdown"].includes(game.rule) && (
                <ConfigNumberInput input_id="lose_point" label="失格誤答数" />
              )}
              {["attacksurvival"].includes(game.rule) && (
                <>
                  <ConfigNumberInput
                    input_id="win_point"
                    label="初期値"
                    max={30}
                  />
                  <ConfigNumberInput
                    input_id="win_through"
                    label="勝ち抜け人数"
                    max={game.count}
                  />
                  <ConfigNumberInput
                    input_id="correct_me"
                    label="自分が正答"
                    min={-10}
                  />
                  <ConfigNumberInput
                    input_id="wrong_me"
                    label="自分が誤答"
                    min={-10}
                  />
                  <ConfigNumberInput
                    input_id="correct_other"
                    label="他人が正答"
                    min={-10}
                  />
                  <ConfigNumberInput
                    input_id="wrong_other"
                    label="他人が誤答"
                    min={-10}
                  />
                </>
              )}
              {["squarex"].includes(game.rule) && (
                <ConfigNumberInput input_id="win_point" label="X" max={100} />
              )}
            </div>

            <h2>プレイヤー設定</h2>
            {players?.map((player, i) => (
              <div key={player.id} style={{ marginTop: "1rem" }}>
                <h3>プレイヤー {i + 1}</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <PlayerConfigInput
                    input_id="name"
                    player_id={player.id!}
                    label="プレイヤー名"
                    placehodler={`プレイヤー${i + 1}`}
                  />
                  <PlayerConfigInput
                    input_id="belong"
                    player_id={player.id!}
                    label="所属"
                    placehodler="〇〇高校"
                  />
                  {["normal", "nomx", "nbyn", "nupdown", "swedishx"].includes(
                    game.rule
                  ) && (
                    <PlayerConfigInput
                      number
                      input_id="initial_correct"
                      player_id={player.id!}
                      label="初期正答ポイント"
                    />
                  )}
                </div>
              </div>
            ))}

            <h2>問題設定</h2>
            {quizes ? (
              <Form.Field>
                <label>セット名</label>
                <Select
                  value={game.quiz_set}
                  options={quizsetList.map((quiz) => {
                    return { value: quiz, text: quiz };
                  })}
                  onChange={(e, data) => {
                    db.games.update(Number(game_id), {
                      quizset_name: data.value,
                    });
                  }}
                  style={{ width: 200 }}
                />
              </Form.Field>
            ) : (
              <div>データベースが見つかりません。</div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Link href="/">
                <Button>ホームに戻る</Button>
              </Link>
              <Button color="red" onClick={deleteGame}>
                ゲームを削除
              </Button>
              <Link href={`/${game_id}/board`}>
                <Button primary>ゲーム開始</Button>
              </Link>
            </div>
          </Form>
        </Container>
      </main>
    </div>
  );
};

export default Config;
