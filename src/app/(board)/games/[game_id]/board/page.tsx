import { Metadata } from "next";
import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import BoardHeader from "./_components/BoardHeader";
import GameLogs from "./_components/GameLogs";
import Player from "./_components/Player";

import computeScore from "#/utils/computeScore";
import { Database } from "#/utils/schema";
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
  const supabase = createServerComponentClient<Database>({ cookies });
  const gameDBResponse = await supabase
    .from("games")
    .select()
    .eq("id", game_id)
    .single();
  const gamePlayerDBResponse = await supabase
    .from("game_players")
    .select("*, players (*)")
    .eq("game_id", game_id);
  const gameLogDBResponse = await supabase
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
    game_players,
    game_logs,
  });

  return (
    <>
      <BoardHeader game={game} logs={game_logs} />
      {game.rule === "squarex" && (
        <div
          className={css({
            position: "absolute",
            writingMode: "vertical-rl",
            textOverflow: "ellipsis",
            textOrientation: "upright",
            h: "100vh",
            w: "1vw",
            bgColor: "green.500",
            left: game_logs.length % 2 === 0 ? 0 : undefined,
            right: game_logs.length % 2 === 1 ? 0 : undefined,
            zIndex: 10,
          })}
        />
      )}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          flexWrap: "nowrap",
          gap: "1.5vh 1vw",
          w: "100%",
          h: "100%",
          px: "1vw",
          pt: "3vh",
          lg: {
            flexDirection: "row",
            h: "80vh",
          },
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
