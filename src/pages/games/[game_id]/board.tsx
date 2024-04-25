import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Button, IconButton, Slide, Tooltip } from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";
import { X } from "tabler-icons-react";

import BoardHeader from "~/features/board/BoardHeader";
import GameLogs from "~/features/board/GameLogs";
import Player from "~/features/board/Player";
import WinModal from "~/features/board/WinModal";
import useDeviceWidth from "~/hooks/useDeviceWidth";
import computeScore from "~/utils/computeScore";
import db from "~/utils/db";
import { getRuleStringByType } from "~/utils/rules";
import { ComputedScoreProps, PlayerDBProps } from "~/utils/types";

const BoardPage = () => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const { game_id } = useParams();
  const navigate = useNavigate();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );
  const logs = useLiveQuery(
    () =>
      db(currentProfile)
        .logs.where({ game_id: game_id as string })
        .sortBy("timestamp"),
    []
  );
  const [scores, setScores] = useState<ComputedScoreProps[]>([]);
  const playerList = useLiveQuery(
    () => db(currentProfile).players.toArray(),
    []
  );
  const [players, setPlayers] = useState<PlayerDBProps[]>([]);
  const isDesktop = useDeviceWidth();
  const [skipSuggest, setSkipSuggest] = useState(false);

  useEffect(() => {
    db(currentProfile).games.update(game_id as string, {
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
        const { data: result } = await computeScore(game_id as string);
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

  if (!game || !logs) return null;

  if (game.players.length === 0) {
    navigate(`/${game_id}/config`);
  }

  window.document.onkeydown = async (event) => {
    if (window.location.pathname.endsWith("board") && game && !game.editable) {
      if (event.code.startsWith("Digit")) {
        const playerIndex = Number(event.code[5]);
        if (
          typeof playerIndex === "number" &&
          !isNaN(playerIndex) &&
          playerIndex <= players.length
        ) {
          if (playerIndex === 0 && players.length >= 10) {
            await db(currentProfile).logs.put({
              id: nanoid(),
              game_id: game.id,
              player_id: players[9].id,
              variant: event.shiftKey ? "wrong" : "correct",
              system: false,
              timestamp: cdate().text(),
            });
          } else if (playerIndex > 0) {
            await db(currentProfile).logs.put({
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
          await db(currentProfile).logs.put({
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
          await db(currentProfile).logs.delete(logs[logs.length - 1].id);
        }
      } else if (event.code === "Period") {
        await db(currentProfile).logs.put({
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
            bgColor: "green.500",
            left: logs.length % 2 === 0 ? 0 : undefined,
            right: logs.length % 2 === 1 ? 0 : undefined,
            zIndex: 10,
          }}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection:
            (isDesktop && players.length > 10) || !isDesktop ? "column" : "row",
          justifyContent:
            (isDesktop && players.length > 10) || !isDesktop
              ? "flex-start"
              : "space-evenly",
          flexWrap: isDesktop && players.length > 10 ? "wrap" : "nowrap",
          gap: "1.5vh 1vw",
          w: "100%",
          h: ["auto", "auto", "90vh", "90vh", "85vh"],
          px: "1vw",
          pt: "3vh",
        }}
        id="players-area"
      >
        {players.map((player, i) => (
          <Player
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
      </Box>
      <GameLogs logs={logs} players={players} quiz={game.quiz} />
      <WinModal
        onClose={() => setWinThroughPlayer({ name: "", text: "" })}
        roundName={getRuleStringByType(game)}
        winTroughPlayer={winThroughPlayer}
      />
      <Slide direction="bottom" in={skipSuggest} style={{ zIndex: 1000 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: ["column", "column", "row"],
            gap: 1,
            justifyContent: "space-between",
            m: 5,
            p: 3,
            rounded: "2xl",
            alignItems: "center",
            _dark: {
              bg: "gray.700",
              color: "white",
            },
          }}
        >
          <Box>すべてのプレイヤーが休みの状態です。1問スルーしますか？</Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              colorScheme="blue"
              onClick={() =>
                db(currentProfile).logs.put({
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
                    db(currentProfile).logs.put({
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
          </Box>
        </Box>
      </Slide>
    </>
  );
};

export default BoardPage;
