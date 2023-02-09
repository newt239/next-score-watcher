import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Box, Flex, theme, useMediaQuery } from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";

import AnswerPlayerTable from "#/components/board/AnswerPlayerTable";
import BoardHeader from "#/components/board/BoardHeader";
import GameLogs from "#/components/board/GameLogs";
import Player from "#/components/board/Player";
import WinModal from "#/components/board/WinModal";
import { getConfig } from "#/hooks/useBooleanConfig";
import computeScore from "#/utils/computeScore";
import db, { ComputedScoreDBProps, PlayerDBProps } from "#/utils/db";

const BoardPage: NextPage = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: game_id as string }).sortBy("timestamp"),
    []
  );
  const [scores, setScores] = useState<ComputedScoreDBProps[]>([]);
  const playerList = useLiveQuery(() => db.players.toArray(), []);
  const [players, setPlayers] = useState<PlayerDBProps[]>([]);
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  useEffect(() => {
    db.games.update(game_id as string, { last_open: cdate().text() });
  }, []);

  useEffect(() => {
    if (playerList) {
      const gamePlayers = (
        game?.players.map((gamePlayer) =>
          playerList.find((player) => player.id === gamePlayer.id)
        ) || []
      )
        // undefined が消えてくれないのでタイプガードを使う
        // https://qiita.com/suin/items/cda9af4f4f1c53c05c6f
        .filter((v): v is PlayerDBProps => v !== undefined);
      setPlayers(gamePlayers);
    }
  }, [playerList]);

  const [winThroughPlayer, setWinThroughPlayer] = useState<{
    name: string;
    text: string;
  }>({ name: "", text: "" });

  useEffect(() => {
    const executeComputeScore = async () => {
      const result = await computeScore(game_id as string);
      setScores(result.scoreList);
      if (result.winThroughPlayer) {
        const playerName = playerList?.find(
          (player) => player.id! === result.winThroughPlayer.player_id
        )?.name;
        if (playerName) {
          setWinThroughPlayer({
            name: playerName,
            text: result.winThroughPlayer.text,
          });
        }
      }
    };
    executeComputeScore();
  }, [logs]);

  if (!game || !logs) return null;

  return (
    <>
      <Head>
        <title>Score Watcher</title>
      </Head>
      <BoardHeader game={game} logs={logs} />
      {game.rule === "squarex" && (
        <Box sx={{ textAlign: "center" }}>
          次の問題では
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: theme.colors.green[500],
            }}
          >
            {logs.length % 2 === 1 ? "＞＞右側＞＞" : "＜＜左側＜＜"}
          </span>
          の変数が変動します
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: isLargerThan700 ? "row" : "column",
          gap: "1rem",
          width: "100%",
          justifyContent: "space-evenly",
          padding: 3,
        }}
      >
        {players.map((player, i) => (
          <Player
            player={player}
            key={i}
            index={i}
            score={scores.find(
              (score) =>
                score.game_id === game.id && score.player_id === player.id
            )}
            qn={logs.length}
            last_correct_player_id={
              scores.sort((a, b) => a.last_correct - b.last_correct)[0]
                .player_id
            }
          />
        ))}
      </Box>
      {getConfig("scorewatcher-show-logs") && (
        <Flex
          sx={{
            justifyContent: "space-evenly",
            flexDirection: isLargerThan700 ? "row" : "column",
            my: 10,
          }}
        >
          <GameLogs players={players} logs={logs} />
          <AnswerPlayerTable players={players} logs={logs} />
        </Flex>
      )}
      <WinModal
        winTroughPlayer={winThroughPlayer}
        onClose={() => setWinThroughPlayer({ name: "", text: "" })}
        roundName={game.name}
      />
    </>
  );
};

export default BoardPage;
