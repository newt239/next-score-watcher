import { NextPageWithLayout } from "next";
import Head from "next/head";
import router from "next/router";
import { useEffect } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import LinkButton from "#/blocks/LinkButton";
import ConfigInput from "#/components/config/ConfigInput";
import ConfigNumberInput from "#/components/config/ConfigNumberInput";
import SelectPlayer from "#/components/config/SelectPlayer";
import SelectQuizset from "#/components/config/SelectQuizSet";
import { Layout } from "#/layouts/Layout";
import db from "#/utils/db";
import { rules } from "#/utils/rules";
const ConfigPage: NextPageWithLayout = () => {
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const players = useLiveQuery(() => db.players.orderBy("name").toArray(), []);
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: game_id as string }).toArray(),
    []
  );
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));

  useEffect(() => {
    db.games.update(game_id as string, { last_open: cdate().text() });
  }, []);

  if (!game || !players || !logs) return null;

  const deleteGame = async () => {
    await db.games.delete(game.id);
    router.push("/");
  };

  const disabled = logs.length !== 0;

  return (
    <>
      <Head>
        <title>Score Watcher</title>
      </Head>
      {disabled ? (
        <Alert status="error">
          ゲームは開始済みです。一部の設定は変更できません。
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
          {["nomx", "nomx-ad"].includes(game.rule) && (
            <>
              <ConfigNumberInput
                input_id="win_point"
                label="勝ち抜け正解数"
                max={30}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="lose_point"
                label="失格誤答数"
                max={30}
                disabled={disabled}
              />
            </>
          )}
          {["various-fluctuations"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="win_point"
              label="勝ち抜けポイント"
              max={1000}
              min={3}
              disabled={disabled}
            />
          )}
          {["nbyn", "nupdown"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="win_point"
              label="N"
              max={10}
              disabled={disabled}
            />
          )}
          {["squarex", "swedishx", "freezex"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="win_point"
              label="X"
              max={100}
              disabled={disabled}
            />
          )}
          {["nupdown"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="lose_point"
              label="失格誤答数"
              disabled={disabled}
            />
          )}
          {["attacksurvival"].includes(game.rule) && (
            <>
              <ConfigNumberInput
                input_id="win_point"
                label="初期値"
                max={30}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="win_through"
                label="勝ち抜け人数"
                max={game.players.length}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="correct_me"
                label="自分が正答"
                min={-10}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="wrong_me"
                label="自分が誤答"
                min={-10}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="correct_other"
                label="他人が正答"
                min={-10}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="wrong_other"
                label="他人が誤答"
                min={-10}
                disabled={disabled}
              />
            </>
          )}
        </div>
        <SelectPlayer
          game_id={game.id}
          rule_name={game.rule}
          playerList={players}
          players={game.players}
          disabled={disabled}
        />
        <SelectQuizset
          game_id={game.id}
          default_quizset={game.quiz_set || ""}
          quizset_names={quizsetList}
        />
        <Flex
          sx={{
            flexDirection: isLargerThan400 ? "row" : "column-reverse",
            justifyContent: "space-between",
            pt: 20,
            gap: 5,
          }}
        >
          <Button leftIcon={<Trash />} colorScheme="red" onClick={deleteGame}>
            ゲームを削除
          </Button>
          <LinkButton
            icon={<PlayerPlay />}
            colorScheme="green"
            href={`/${game_id}/board`}
            disabled={game.players.length === 0}
          >
            ゲーム開始
          </LinkButton>
        </Flex>
      </Box>
    </>
  );
};

ConfigPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ConfigPage;
