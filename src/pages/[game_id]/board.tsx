import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Alert, Box, useMediaQuery } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import BoardHeader from "#/components/BoardHeader";
import Header from "#/components/Header";
import Player from "#/components/Player";
import WinModal from "#/components/WinModal";
import computeScore from "#/utils/computeScore";
import db, { PlayerDBProps } from "#/utils/db";

const BoardPage: NextPage = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const computed_scores = useLiveQuery(
    () => db.computed_scores.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const playerList = useLiveQuery(() => db.players.toArray(), []);
  const [players, setPlayers] = useState<PlayerDBProps[]>([]);

  useEffect(() => {
    if (playerList) {
      setPlayers(
        playerList.filter((player) => game?.players.includes(Number(player.id)))
      );
    }
  }, [playerList]);

  const [winThroughPeople, setWinThroughPeople] = useState<[string, string][]>(
    []
  );
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  useEffect(() => {
    const executeComputeScore = async () => {
      const result = await computeScore(Number(game_id));
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
        <title>ゲーム画面</title>
      </Head>
      <BoardHeader />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          marginTop: 5,
        }}
      >
        {players.map((player, i) => (
          <Player
            player={player}
            key={i}
            index={i}
            score={computed_scores.find(
              (score) =>
                score.game_id === game.id && score.player_id === player.id
            )}
            qn={logs.length}
          />
        ))}
      </div>
      <WinModal
        winTroughPeople={winThroughPeople}
        onClose={() => setWinThroughPeople([])}
      />
    </>
  );
};

export default BoardPage;
