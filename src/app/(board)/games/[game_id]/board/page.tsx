"use client";

import { useEffect, useState } from "react";

import { ActionIcon, Box, Button, Flex, Tooltip } from "@mantine/core";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";
import { X } from "tabler-icons-react";

import BoardHeader from "./_components/BoardHeader/BoardHeader";
import GameLogs from "./_components/GameLogs";
import Player from "./_components/Player/Player";
import WinModal from "./_components/WinModal";

import NotFound from "@/app/(default)/_components/NotFound";
import computeScore from "@/utils/computeScore";
import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";
import { ComputedScoreProps, PlayerDBProps } from "@/utils/types";

export default function BoardPage({ params }: { params: { game_id: string } }) {
  const game = useLiveQuery(() => db().games.get(params.game_id as string));
  const logs = useLiveQuery(
    () =>
      db()
        .logs.where({ game_id: params.game_id as string })
        .sortBy("timestamp"),
    []
  );
  const [scores, setScores] = useState<ComputedScoreProps[]>([]);
  const playerList = useLiveQuery(() => db().players.toArray(), []);
  const [players, setPlayers] = useState<PlayerDBProps[]>([]);
  const [skipSuggest, setSkipSuggest] = useState(false);

  useEffect(() => {
    db().games.update(params.game_id as string, {
      last_open: cdate().text(),
    });
  }, []);

  useEffect(() => {
    if (game) {
      document.title = `${game.name} | Score Watcher`;
    }
  }, [game]);

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
  }, [playerList, game]);

  const [winThroughPlayer, setWinThroughPlayer] = useState<{
    name: string;
    text: string;
  }>({ name: "", text: "" });

  useEffect(() => {
    if (logs) {
      const executeComputeScore = async () => {
        const { data: result } = await computeScore(params.game_id as string);
        setScores(result.scores);
        if (result.win_players.length > 0) {
          if (result.win_players[0].name) {
            setWinThroughPlayer({
              name: result.win_players[0].name,
              text: result.win_players[0].text,
            });
          }
        }
        const playingPlayers = result.scores.filter(
          (score) => score.state === "playing"
        );
        if (
          playingPlayers.length > 0 &&
          playingPlayers.length === result.incapacity_players.length
        ) {
          setSkipSuggest(true);
        } else {
          setSkipSuggest(false);
        }
      };
      executeComputeScore();
    }
  }, [logs]);

  if (!game || game.players.length === 0 || !logs) return <NotFound />;

  window.document.onkeydown = async (event) => {
    if (window.location.pathname.endsWith("board") && game && !game.editable) {
      if (event.code.startsWith("Digit") || event.code.startsWith("Numpad")) {
        const playerIndex =
          event.code[0] === "D" ? Number(event.code[5]) : Number(event.code[6]);
        if (
          typeof playerIndex === "number" &&
          !isNaN(playerIndex) &&
          playerIndex <= players.length
        ) {
          if (playerIndex === 0 && players.length >= 10) {
            await db().logs.put({
              id: nanoid(),
              game_id: game.id,
              player_id: players[9].id,
              variant: event.shiftKey ? "wrong" : "correct",
              system: false,
              timestamp: cdate().text(),
            });
          } else if (playerIndex > 0) {
            await db().logs.put({
              id: nanoid(),
              game_id: game.id,
              player_id: players[playerIndex - 1].id,
              variant: event.shiftKey ? "wrong" : "correct",
              system: false,
              timestamp: cdate().text(),
            });
          }
        }
      } else if (["Minus", "Equal", "IntlYen"].includes(event.code)) {
        const playerIndex =
          ["Minus", "Equal", "IntlYen"].indexOf(event.code) + 10;
        if (playerIndex <= players.length) {
          await db().logs.put({
            id: nanoid(),
            game_id: game.id,
            player_id: players[playerIndex].id,
            variant: event.shiftKey ? "wrong" : "correct",
            system: false,
            timestamp: cdate().text(),
          });
        }
      } else if (
        event.code === "Comma" ||
        (event.code === "KeyZ" && event.ctrlKey)
      ) {
        if (logs.length !== 0) {
          await db().logs.delete(logs[logs.length - 1].id);
        }
      } else if (event.code === "Period") {
        await db().logs.put({
          id: nanoid(),
          game_id: game.id,
          player_id: "-",
          variant: "through",
          system: false,
          timestamp: cdate().text(),
        });
      }
    }
  };

  return (
    <>
      <BoardHeader game={game} logs={logs} />
      {game.rule === "squarex" && (
        <Box
          className="absolute z-10 h-full w-[1vw] bg-green-500"
          style={{
            writingMode: "vertical-rl",
            textOverflow: "ellipsis",
            textOrientation: "upright",
            left: logs.length % 2 === 0 ? 0 : undefined,
            right: logs.length % 2 === 1 ? 0 : undefined,
          }}
        />
      )}
      <Flex
        className="h-[90vh] w-full flex-row justify-evenly gap-x-[1vw] gap-y-[1.5vh] px-[1vw] pt-[3vh]"
        id="players-area"
      >
        {players.map((player, i) => (
          <Player
            game_id={game.id}
            index={i}
            isVerticalView={players.length > 10}
            key={i}
            player={player}
            score={scores.find(
              (score) =>
                score.game_id === game.id && score.player_id === player.id
            )}
          />
        ))}
      </Flex>
      <GameLogs logs={logs} players={players} quiz={game.quiz} />
      <WinModal
        onClose={() => setWinThroughPlayer({ name: "", text: "" })}
        roundName={getRuleStringByType(game)}
        winTroughPlayer={winThroughPlayer}
      />
      {skipSuggest && (
        <Flex className="m-5 flex-row items-center justify-evenly gap-1 rounded-2xl p-3">
          <Box>すべてのプレイヤーが休みの状態です。1問スルーしますか？</Box>
          <Flex className="gap-1">
            <Button
              color="blue"
              onClick={() =>
                db().logs.put({
                  id: nanoid(),
                  game_id: game.id,
                  player_id: "-",
                  variant: "through",
                  system: false,
                  timestamp: cdate().text(),
                })
              }
              size="sm"
            >
              スルー
            </Button>
            <div className="hidden md:block">
              <Tooltip label="問題番号が進みますが、問題は更新されません。">
                <Button
                  onClick={() =>
                    db().logs.put({
                      id: nanoid(),
                      game_id: game.id,
                      player_id: "-",
                      variant: "skip",
                      system: false,
                      timestamp: cdate().text(),
                    })
                  }
                  size="sm"
                >
                  スキップ
                </Button>
              </Tooltip>
            </div>
            <ActionIcon
              aria-label="閉じる"
              onClick={() => setSkipSuggest(false)}
              size="md"
            >
              <X />
            </ActionIcon>
          </Flex>
        </Flex>
      )}
    </>
  );
}
