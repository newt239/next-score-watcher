import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Alert, Box, useMediaQuery } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import BoardHeader from "#/components/BoardHeader";
import Header from "#/components/Header";
import Player from "#/components/Player";
import WinModal from "#/components/WinModal";
import computeScore from "#/utils/computeScore";
import db from "#/utils/db";

const Board: NextPage = () => {
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
  const computed_scores = useLiveQuery(
    () => db.computed_scores.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const [winThroughPeople, setWinThroughPeople] = useState<[string, string][]>(
    []
  );
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  useEffect(() => {
    computeScore(Number(game_id)).then((newWinThroughPeople) => {
      if (newWinThroughPeople.length !== 0) {
        setWinThroughPeople(
          newWinThroughPeople.map((winThroughPlayer) => {
            const playerName = players?.find(
              (player) => player.id! === winThroughPlayer[0]
            )?.name;
            if (playerName) {
              return [playerName, winThroughPlayer[1]];
            } else {
              return [`player_id: ${winThroughPlayer[0]}`, winThroughPlayer[1]];
            }
          })
        );
      }
    });
  }, [logs]);

  if (!game || !players || !computed_scores) {
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
    <div>
      <BoardHeader />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          marginTop: 5,
        }}
      >
        {players?.map((player, i) => (
          <Player
            player={player}
            key={i}
            index={i}
            score={computed_scores.find(
              (score) => score.player_id === player.id
            )}
          />
        ))}
      </div>
      <WinModal
        winTroughPeople={winThroughPeople}
        onClose={() => setWinThroughPeople([])}
      />
    </div>
  );
};

export default Board;
