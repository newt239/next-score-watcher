import { Metadata } from "next";
import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import BoardHeader from "./_components/BoardHeader";
import GameLogs from "./_components/GameLogs";
import Player from "./_components/Player";

import { Database } from "#/utils/schema";
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
  const { data: game } = await supabase
    .from("games")
    .select()
    .eq("id", game_id)
    .single();
  const { data: game_players } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", game_id);
  const { data: game_logs } = await supabase
    .from("game_logs")
    .select("*")
    .eq("game_id", game_id);

  if (!game || !game_logs || !game_players) return null;

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
          h: ["90vh", "90vh", "85vh"],
          px: "1vw",
          pt: "3vh",
        })}
        id="players-area"
      >
        {game_players.map((player, i) => (
          <Player
            index={i}
            key={i}
            player={player}
            score={scores.find(
              (score) =>
                score.game_id === game.id && score.player_id === player.id
            )}
          />
        ))}
      </div>
      <GameLogs logs={game_logs} players={game_players} quiz={game.quiz} />
    </>
  );
}
