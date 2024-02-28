import { Metadata } from "next";

import BoardHeader from "./_components/BoardHeader";
import GameLogs from "./_components/GameLogs";
import Player from "./_components/Player";

import computeScore from "#/utils/computeScore";
import { serverClient } from "#/utils/supabase";
import {
  GameDBProps,
  GameLogDBProps,
  GamePlayerWithProfileProps,
} from "#/utils/types";
import { css } from "@panda/css";

export const metadata: Metadata = {
  title: "Score Watcher",
};

export default async function GameBoardPage({
  params,
}: {
  params: { game_id: string };
}) {
  const game_id = params.game_id;
  const gameDBResponse = await serverClient
    .from("games")
    .select()
    .eq("id", game_id)
    .single();
  const gamePlayerDBResponse = await serverClient
    .from("game_players")
    .select("*, players (*)")
    .eq("game_id", game_id);
  const gameLogDBResponse = await serverClient
    .from("game_logs")
    .select("*")
    .eq("game_id", game_id);

  if (
    !gameDBResponse.data ||
    !gamePlayerDBResponse.data ||
    !gameLogDBResponse.data
  )
    return null;

  const game = gameDBResponse.data as GameDBProps;
  const game_players =
    gamePlayerDBResponse.data as GamePlayerWithProfileProps[];
  console.log(game_players);
  const game_logs = gameLogDBResponse.data as GameLogDBProps[];

  const result = await computeScore({
    game,
    game_logs,
    game_players,
  });

  console.log(result);

  return (
    <>
      <BoardHeader game={game} logs={game_logs} />
      {game.rule === "squarex" && (
        <div
          className={css({
            bgColor: "green.500",
            h: "100vh",
            left: game_logs.length % 2 === 0 ? 0 : undefined,
            position: "absolute",
            right: game_logs.length % 2 === 1 ? 0 : undefined,
            textOrientation: "upright",
            textOverflow: "ellipsis",
            w: "1vw",
            writingMode: "vertical-rl",
            zIndex: 10,
          })}
        />
      )}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          gap: "1.5vh 1vw",
          h: "100%",
          justifyContent: "space-evenly",
          lg: {
            flexDirection: "row",
            h: "80vh",
          },
          pt: "3vh",
          px: "1vw",
          w: "100%",
        })}
        id="players-area"
      >
        {game_players.map((game_player, i) => {
          return (
            <Player
              game={game}
              index={i}
              key={i}
              player={game_player}
              score={result.scores.find(
                (score) =>
                  score.game_id === game.id &&
                  score.player_id === game_player.id
              )}
            />
          );
        })}
      </div>
      <GameLogs logs={game_logs} players={game_players} quiz={game.quiz} />
    </>
  );
}
