"use client";

import { useEffect, useState } from "react";

import { ActionIcon, Box, Button, Flex, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";
import { X } from "tabler-icons-react";

import AQL from "../AQL/AQL";
import ActionButtons from "../ActionButtons/ActionButtons";
import BoardHeader from "../BoardHeader/BoardHeader";
import GameLogs from "../GameLogs/GameLogs";
import Players from "../Players/Players";
import WinModal from "../WinModal/WinModal";

import classes from "./Board.module.css";

import NotFound from "@/app/(default)/_components/NotFound";
import computeScore from "@/utils/computeScore";
import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";
import { ComputedScoreProps, PlayerDBProps } from "@/utils/types";

type Props = {
  game_id: string;
  current_profile: string;
};

const Board: React.FC<Props> = ({ game_id, current_profile }) => {
  const game = useLiveQuery(() =>
    db(current_profile).games.get(game_id as string)
  );
  const logs = useLiveQuery(
    () =>
      db(current_profile)
        .logs.where({ game_id: game_id as string })
        .sortBy("timestamp"),
    []
  );
  const [scores, setScores] = useState<ComputedScoreProps[]>([]);
  const playerList = useLiveQuery(
    () => db(current_profile).players.toArray(),
    []
  );
  const [players, setPlayers] = useState<PlayerDBProps[]>([]);
  const [skipSuggest, setSkipSuggest] = useState(false);

  const [showHeader] = useLocalStorage({
    key: "showBoardHeader",
    defaultValue: true,
  });

  useEffect(() => {
    db(current_profile).games.update(game_id as string, {
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
        const { data: result } = await computeScore(
          game_id as string,
          current_profile
        );
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
            await db(current_profile).logs.put({
              id: nanoid(),
              game_id: game.id,
              player_id: players[9].id,
              variant: event.shiftKey ? "wrong" : "correct",
              system: false,
              timestamp: cdate().text(),
            });
          } else if (playerIndex > 0) {
            await db(current_profile).logs.put({
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
          await db(current_profile).logs.put({
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
        (event.code === "KeyZ" && event.ctrlKey) ||
        (event.code === "KeyZ" && event.metaKey)
      ) {
        if (logs.length !== 0) {
          await db(current_profile).logs.delete(logs[logs.length - 1].id);
        }
      } else if (event.code === "Period") {
        await db(current_profile).logs.put({
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
      <BoardHeader game={game} logs={logs} currentProfile={current_profile} />
      {game.rule === "squarex" && (
        <Box
          className={classes.squarex_bar}
          style={{
            left: logs.length % 2 === 0 ? 0 : undefined,
            right: logs.length % 2 === 1 ? 0 : undefined,
          }}
        />
      )}
      {game.rule === "aql" ? (
        <AQL
          players={players}
          scores={scores}
          game={game}
          currentProfile={current_profile}
          team_name={game.options}
          show_header={showHeader}
        />
      ) : (
        <Players
          game={game}
          scores={scores}
          players={players}
          currentProfile={current_profile}
          show_header={showHeader}
        />
      )}
      <ActionButtons game={game} logs={logs} currentProfile={current_profile} />
      <GameLogs
        logs={logs}
        players={players}
        quiz={game.quiz}
        currentProfile={current_profile}
      />
      <WinModal
        onClose={() => setWinThroughPlayer({ name: "", text: "" })}
        roundName={getRuleStringByType(game)}
        winTroughPlayer={winThroughPlayer}
      />
      {skipSuggest && (
        <Flex className={classes.skip_suggest}>
          <Box>すべてのプレイヤーが休みの状態です。1問スルーしますか？</Box>
          <Flex gap="sm">
            <Button
              color="blue"
              onClick={() =>
                db(current_profile).logs.put({
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
            <Box visibleFrom="md">
              <Tooltip label="問題番号が進みますが、問題は更新されません。">
                <Button
                  onClick={() =>
                    db(current_profile).logs.put({
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
            </Box>
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
};

export default Board;
