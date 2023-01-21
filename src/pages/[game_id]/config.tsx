import { NextPageWithLayout } from "next";
import Head from "next/head";
import NextLink from "next/link";
import router from "next/router";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import LinkButton from "#/blocks/LinkButton";
import ConfigInput from "#/components/config/ConfigInput";
import ConfigNumberInput from "#/components/config/ConfigNumberInput";
import SelectPlayer from "#/components/config/SelectPlayer";
import { Layout } from "#/layouts/Layout";
import db from "#/utils/db";
import { rules } from "#/utils/rules";
const ConfigPage: NextPageWithLayout = () => {
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const players = useLiveQuery(() => db.players.orderBy("name").toArray(), []);
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: game_id as string }).toArray(),
    []
  );
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));

  if (!game || !players || !logs) {
    return null;
  }

  const deleteGame = () => {
    db.games.delete(game.id).then(() => router.push("/"));
  };

  return (
    <>
      <Head>
        <title>Score Watcher</title>
      </Head>
      {logs.length !== 0 ? (
        <Alert status="error">
          ゲームは開始済みです。設定の変更はできません。
        </Alert>
      ) : (
        <Alert status="info">
          <Box>
            <AlertTitle>{rules[game.rule].name}</AlertTitle>
            <AlertDescription>
              {rules[game.rule].description.split("\n").map((p) => (
                <p key={p}>{p}</p>
              ))}
            </AlertDescription>
          </Box>
        </Alert>
      )}
      <Box>
        <H2>形式設定</H2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <ConfigInput
            input_id="name"
            label="ラウンド名"
            placehodler="〇〇大会"
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
          {["nbyn", "nupdown"].includes(game.rule) && (
            <ConfigNumberInput input_id="win_point" label="N" max={10} />
          )}
          {["squarex", "swedishx", "freezx"].includes(game.rule) && (
            <ConfigNumberInput input_id="win_point" label="X" max={100} />
          )}
          {["nupdown"].includes(game.rule) && (
            <ConfigNumberInput input_id="lose_point" label="失格誤答数" />
          )}
          {["attacksurvival"].includes(game.rule) && (
            <>
              <ConfigNumberInput input_id="win_point" label="初期値" max={30} />
              <ConfigNumberInput
                input_id="win_through"
                label="勝ち抜け人数"
                max={game.players.length}
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
        </div>

        <SelectPlayer
          game_id={game.id}
          rule_name={game.rule}
          playerList={players}
          players={game.players}
          disabled={logs.length !== 0}
        />

        <H2>問題設定</H2>
        {quizsetList.length !== 0 ? (
          <FormControl pt={5} width={200}>
            <FormLabel>セット名</FormLabel>
            <Select
              defaultValue={game.quiz_set || ""}
              onChange={async (v) => {
                await db.games.update(game_id as string, {
                  quiz_set: v.target.value,
                });
              }}
            >
              <option value="">問題を表示しない</option>
              {quizsetList.map((setName) => (
                <option key={setName} value={setName}>
                  {setName}
                </option>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Box p={3}>
            <NextLink href="/quiz">問題管理</NextLink>
            ページから問題データを読み込むことが出来ます。
          </Box>
        )}

        <Box sx={{ textAlign: "right", pt: 5 }}>
          <ButtonGroup spacing={5}>
            <Button leftIcon={<Trash />} colorScheme="red" onClick={deleteGame}>
              ゲームを削除
            </Button>
            <LinkButton
              icon={<PlayerPlay />}
              href={`/${game_id}/board`}
              disabled={game.players.length === 0}
            >
              ゲーム開始
            </LinkButton>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
};

ConfigPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ConfigPage;
