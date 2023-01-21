import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Alert, Box, useMediaQuery } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import Header from "#/components/Header";
import BoardHeader from "#/components/board/BoardHeader";
import GameLogs from "#/components/board/GameLogs";
import Player from "#/components/board/Player";
import WinModal from "#/components/board/WinModal";
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
  const computed_scores = useLiveQuery(
    () => db.computed_scores.where({ game_id: game_id as string }).toArray(),
    []
  );
  const playerList = useLiveQuery(() => db.players.toArray(), []);
  const [players, setPlayers] = useState<PlayerDBProps[]>([]);

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

  const [winThroughPeople, setWinThroughPeople] = useState<[string, string][]>(
    []
  );
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  useEffect(() => {
    const executeComputeScore = async () => {
      const result = await computeScore(game_id as string);
      setScores(result.scoreList);
      if (result.winThroughList.length !== 0) {
        setWinThroughPeople(
          result.winThroughList.map((congratulationPlayer) => {
            const playerName = playerList?.find(
              (player) => player.id! === congratulationPlayer[0]
            )?.name;
            if (playerName) {
              return [playerName, congratulationPlayer[1]];
            } else {
              return [
                `player_id: ${congratulationPlayer[0]}`,
                congratulationPlayer[1],
              ];
            }
          })
        );
      }
    };
    executeComputeScore();
  }, [logs]);

  if (!game || !computed_scores || !logs) {
    return null;
  }

  if (!isLargerThan500) {
    return (
      <Box p={5}>
        <Header />
        <Alert colorScheme="red">
          この画面幅での表示には対応していません。画面幅500px以上の端末をご利用ください。
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Score Watcher</title>
      </Head>
      <BoardHeader game={game} logs={logs} />
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          width: "100%",
          justifyContent: "space-evenly",
          marginTop: 10,
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
          />
        ))}
      </Box>
      <GameLogs players={players} logs={logs} />
      <WinModal
        winTroughPeople={winThroughPeople}
        onClose={() => setWinThroughPeople([])}
      />
    </>
  );
};

export default BoardPage;
