import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Slide,
  theme,
  Tooltip,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import { X } from "tabler-icons-react";

import BoardHeader from "#/components/board/BoardHeader";
import GameLogs from "#/components/board/GameLogs";
import Player from "#/components/board/Player";
import WinModal from "#/components/board/WinModal";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import computeScore from "#/utils/computeScore";
import db from "#/utils/db";
import { showLogsAtom, verticalViewAtom } from "#/utils/jotai";
import { getRuleStringByType } from "#/utils/rules";
import { ComputedScoreProps, PlayerDBProps } from "#/utils/types";

const BoardPage = () => {
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: game_id as string }).sortBy("timestamp"),
    []
  );
  const quizes = useLiveQuery(
    () => db.quizes.where({ set_name: game?.quiz?.set_name }),
    []
  );
  const [scores, setScores] = useState<ComputedScoreProps[]>([]);
  const playerList = useLiveQuery(() => db.players.toArray(), []);
  const [players, setPlayers] = useState<PlayerDBProps[]>([]);
  const isDesktop = useDeviceWidth();
  const isVerticalView = useAtomValue(verticalViewAtom) && isDesktop;
  const showLogs = useAtomValue(showLogsAtom);
  const [skipSuggest, setSkipSuggest] = useState(false);

  useEffect(() => {
    db.games.update(game_id as string, { last_open: cdate().text() });
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
        const result = await computeScore(game_id as string);
        setScores(result.scores);
        if (result.win_players.length > 0) {
          if (result.win_players[0].name) {
            setWinThroughPlayer({
              name: result.win_players[0].name,
              text: result.win_players[0].text,
            });
          }
        }
        if (result.scores.length === result.incapacity_players.length) {
          setSkipSuggest(true);
        } else {
          setSkipSuggest(false);
        }
      };
      executeComputeScore();
    }
  }, [logs]);

  if (!game || !logs) return null;

  window.document.onkeydown = async (event) => {
    if (game) {
      if (event.code.startsWith("Digit")) {
        const playerIndex = Number(event.code[5]);
        if (playerIndex <= players.length) {
          await db.logs.put({
            id: nanoid(),
            game_id: game.id,
            player_id: players[playerIndex === 0 ? 9 : playerIndex - 1].id,
            variant: event.shiftKey ? "wrong" : "correct",
            system: false,
            timestamp: cdate().text(),
          });
        }
      } else if (["Minus", "Equal", "IntlYen"].includes(event.code)) {
        const playerIndex =
          ["Minus", "Equal", "IntlYen"].indexOf(event.code) + 10;
        if (playerIndex <= players.length) {
          await db.logs.put({
            id: nanoid(),
            game_id: game.id,
            player_id: players[playerIndex].id,
            variant: event.shiftKey ? "wrong" : "correct",
            system: false,
            timestamp: cdate().text(),
          });
        }
      } else if (event.code === "Comma") {
        if (logs.length !== 0) {
          await db.logs.delete(logs[logs.length - 1].id);
        }
      } else if (event.code === "Period") {
        await db.logs.put({
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
          sx={{
            position: "absolute",
            writingMode: "vertical-rl",
            textOverflow: "ellipsis",
            textOrientation: "upright",
            h: "100vh",
            w: "1vw",
            backgroundColor: theme.colors.green[500],
            left: logs.length % 2 === 0 ? 0 : undefined,
            right: logs.length % 2 === 1 ? 0 : undefined,
            zIndex: 10,
          }}
        />
      )}
      <Flex
        id="players-area"
        sx={{
          flexDirection: isDesktop && !isVerticalView ? "row" : "column",
          justifyContent:
            isDesktop && !isVerticalView ? "space-evenly" : "flex-start",
          flexWrap: isVerticalView ? "wrap" : "nowrap",
          gap: "1rem",
          w: "100%",
          h: isVerticalView ? "75vh" : "auto",
          p: 3,
          overflowX: "scroll",
        }}
      >
        {players.map((player, i) => (
          <Player
            index={i}
            key={i}
            last_correct_player={
              scores.length !== 0
                ? scores.sort((a, b) => b.last_correct - a.last_correct)[0]
                    .player_id
                : ""
            }
            player={player}
            qn={logs.length}
            score={scores.find(
              (score) =>
                score.game_id === game.id && score.player_id === player.id
            )}
          />
        ))}
      </Flex>
      {showLogs && (
        <Flex sx={{ justifyContent: "center" }}>
          <GameLogs logs={logs} players={players} quiz={game.quiz} />
        </Flex>
      )}
      <WinModal
        onClose={() => setWinThroughPlayer({ name: "", text: "" })}
        roundName={getRuleStringByType(game)}
        winTroughPlayer={winThroughPlayer}
      />
      <Slide direction="bottom" in={skipSuggest} style={{ zIndex: 1000 }}>
        <Flex
          alignItems="center"
          bg="gray.700"
          color="white"
          flexDirection={isDesktop ? "row" : "column"}
          gap={1}
          justifyContent="space-between"
          m={5}
          p={3}
          rounded="2xl"
        >
          <Box>すべてのプレイヤーが休みの状態です。1問スルーしますか？</Box>
          <Flex gap={1}>
            <Button
              colorScheme="blue"
              onClick={() =>
                db.logs.put({
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
            {isDesktop && (
              <Tooltip label="問題番号が進みますが、問題は更新されません。">
                <Button
                  colorScheme="green"
                  onClick={() =>
                    db.logs.put({
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
            )}
            <IconButton
              aria-label="閉じる"
              onClick={() => setSkipSuggest(false)}
              size="sm"
            >
              <X />
            </IconButton>
          </Flex>
        </Flex>
      </Slide>
    </>
  );
};

export default BoardPage;
