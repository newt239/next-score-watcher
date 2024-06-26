import { useEffect, useState, type KeyboardEvent } from "react";
import { useParams } from "react-router-dom";

import { Box, Button, Flex, useColorMode } from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";

import AQLBoardHeader from "~/features/board/AQLBoardHeader";
import GameLogs from "~/features/board/GameLogs";
import db from "~/utils/db";
import { AQLGamePropsUnion } from "~/utils/types";

type AQLPlayerStateProps = {
  score: number;
  wrong: number;
};

const AQLBoardPage: React.FC = () => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const { game_id } = useParams();
  const aqlGamesRaw = localStorage.getItem("scorewatcher-aql-games");
  const game = aqlGamesRaw
    ? (JSON.parse(aqlGamesRaw) as { games: AQLGamePropsUnion[] }).games.find(
        (game) => game.id === game_id
      )
    : undefined;
  const logs = useLiveQuery(
    () =>
      db(currentProfile)
        .logs.where({ game_id: game_id as string })
        .sortBy("timestamp"),
    []
  );
  const [end, setEnd] = useState<boolean>(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (game) {
      document.title = `${game.name} | Score Watcher`;
    }
  }, [game]);

  if (!game || !logs) return null;

  const getGameState = () => {
    const playerScores: AQLPlayerStateProps[] = new Array(10).fill({
      score: 1,
      wrong: 0,
    });
    let incapacityPlayerList: number[] = [];
    logs.map((log) => {
      const playerIndex = Number(log.player_id[log.player_id.length - 1]);
      if (log.variant === "correct") {
        playerScores.splice(playerIndex, 1, {
          ...playerScores[playerIndex],
          score: playerScores[playerIndex].score + 1,
        });
      } else if (log.variant === "wrong") {
        const newWrong = playerScores[playerIndex].wrong + 1;
        incapacityPlayerList.filter((incapacityPlayer) => {
          if (playerIndex < 5 ? incapacityPlayer >= 5 : incapacityPlayer < 5) {
            playerScores.splice(incapacityPlayer, 1, {
              ...playerScores[incapacityPlayer],
              wrong: 1,
            });
            return -1;
          } else {
            return 1;
          }
        });
        if (newWrong === 2) {
          incapacityPlayerList.push(playerIndex);
        }
        playerScores.splice(playerIndex, 1, {
          ...playerScores[playerIndex],
          score: 1,
          wrong: playerScores[playerIndex].wrong + 1,
        });
      }
    });
    const pcl = playerScores.map((player) => player.score);
    // 左側
    let leftTeamPoint = 1;
    let leftTeamReachStates = [false, false, false, false, false];
    for (let i = 0; i < 5; i++) {
      leftTeamPoint *= pcl[i];
    }
    for (let i = 0; i < 5; i++) {
      if ((leftTeamPoint / pcl[i]) * (pcl[i] + 1) >= 200) {
        leftTeamReachStates[i] = true;
      }
    }
    // 右側
    let rightTeamPoint = 1;
    let rightTeamReachStates = [false, false, false, false, false];
    for (let i = 5; i < 10; i++) {
      rightTeamPoint *= pcl[i];
    }
    for (let i = 5; i < 10; i++) {
      if ((rightTeamPoint / pcl[i]) * (pcl[i] + 1) >= 200) {
        rightTeamReachStates[i - 5] = true;
      }
    }
    return {
      scores: playerScores,
      leftTeamPoint,
      leftTeamReachStates,
      rightTeamPoint,
      rightTeamReachStates,
      incapacityPlayerList,
    };
  };

  const getPlayerList = (): { id: string; name: string }[] => {
    const playerList: { id: string; name: string }[] = [];
    for (let i = 0; i < 5; i++) {
      playerList.push({
        id: String(i),
        name: `${game.left_team} の No.${i + 1}`,
      });
    }
    for (let i = 5; i < 10; i++) {
      playerList.push({
        id: String(i),
        name: `${game.right_team} の No.${i - 4}`,
      });
    }
    return playerList;
  };

  const onClickHandler = async (variant: "correct" | "wrong", n: number) => {
    await db(currentProfile).logs.put({
      id: nanoid(),
      game_id: game_id as string,
      player_id: String(n),
      variant,
      system: false,
      timestamp: cdate().text(),
    });
  };

  const gameState = getGameState();

  const keyboardShortcutHandler = async (
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (game) {
      if (event.code.startsWith("Digit") || event.code.startsWith("Numpad")) {
        const playerIndex =
          event.code[0] === "D" ? Number(event.code[5]) : Number(event.code[6]);
        if (gameState.scores[playerIndex === 0 ? 9 : playerIndex - 1].wrong < 2)
          await db(currentProfile).logs.put({
            id: nanoid(),
            game_id: game.id,
            player_id: playerIndex === 0 ? String(9) : String(playerIndex - 1),
            variant: event.shiftKey ? "wrong" : "correct",
            system: false,
            timestamp: cdate().text(),
          });
      } else if (event.code === "Comma") {
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

  const EachGroup: React.FC<{ position: "left" | "right" }> = ({
    position,
  }) => {
    const point =
      position === "left" ? gameState.leftTeamPoint : gameState.rightTeamPoint;
    const opposePoint =
      position === "right" ? gameState.leftTeamPoint : gameState.rightTeamPoint;
    const inpacacityPlayers = gameState.incapacityPlayerList.filter((player) =>
      position === "left" ? player < 5 : player >= 5
    );
    let state: "win" | "lose" | "playing" = "playing";
    if (point >= 200) {
      state = "win";
    } else if (opposePoint >= 200) {
      state = "lose";
    } else {
      if (end) {
        if (point > opposePoint) {
          state = "win";
        } else if (opposePoint > point) {
          state = "lose";
        } else {
          state = "playing";
        }
      } else {
        if (inpacacityPlayers.length === 5) {
          state = "lose";
        } else if (
          gameState.incapacityPlayerList.length - inpacacityPlayers.length ===
          5
        ) {
          state = "win";
        } else {
          state = "playing";
        }
      }
    }

    return (
      <Flex
        sx={{
          flexDirection: "column",
          textAlign: "center",
          fontSize: "max(1.5rem, 1.5vw)",
          bgColor:
            state === "win"
              ? "red.600"
              : state === "lose"
              ? "blue.600"
              : undefined,
          p: 1,
          borderRadius: "1rem",
          _dark: {
            bgColor:
              state === "win"
                ? "red.300"
                : state === "lose"
                ? "blue.300"
                : undefined,
          },
        }}
      >
        <Box
          sx={{
            color:
              state !== "playing" && colorMode === "dark"
                ? "gray.800"
                : undefined,
          }}
        >
          {position === "left" ? game.left_team : game.right_team}
        </Box>
        <Box
          sx={{
            fontSize: "4.5rem",
            color:
              state !== "playing" && colorMode === "dark"
                ? "gray.800"
                : undefined,
          }}
        >
          {Math.min(200, point)}
          {state === "win" ? " / WIN" : state === "lose" ? " / LOSE" : ""}
        </Box>
        <Flex
          sx={{
            flexDirection: ["column", "column", "row"],
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          {(position === "left" ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9]).map(
            (n) => {
              const reachState =
                position === "left"
                  ? gameState.leftTeamReachStates[n]
                  : gameState.rightTeamReachStates[n - 5];
              const wrong = gameState.scores[n].wrong;
              return (
                <Flex
                  sx={{
                    flexDirection: ["row", "row", "column"],
                    alignItems: "center",
                    gap: 3,
                    borderStyle: "solid",
                    borderWidth: 2,
                    borderColor:
                      state !== "playing"
                        ? "white"
                        : reachState
                        ? "red.600"
                        : wrong === 1
                        ? "blue.600"
                        : undefined,
                    borderRadius: "1rem",
                    p: 2,
                    backgroundColor:
                      state !== "playing"
                        ? colorMode === "dark"
                          ? "gray.800"
                          : "white"
                        : wrong === 2
                        ? colorMode === "light"
                          ? "blue.600"
                          : "blue.300"
                        : colorMode === "dark"
                        ? "gray.800"
                        : "white",
                    _dark: {
                      borderColor:
                        state !== "playing"
                          ? "gray.800"
                          : reachState
                          ? "red.300"
                          : wrong === 1
                          ? "blue.300"
                          : undefined,
                      backgroundColor:
                        state !== "playing"
                          ? "gray.800"
                          : wrong === 2
                          ? "blue.300"
                          : "gray.800",
                    },
                  }}
                  key={n}
                >
                  <Box>No.{position === "left" ? n + 1 : n - 4}</Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      fontSize: "3rem",
                      fontWeight: 800,
                    }}
                  >
                    {gameState.scores[n].score}
                  </Box>
                  <Button
                    sx={{
                      color: "red.600",
                      _dark: {
                        color: "red.300",
                      },
                    }}
                    colorScheme="red"
                    isDisabled={wrong >= 2}
                    onClick={() => onClickHandler("correct", n)}
                    variant="ghost"
                  >
                    {Math.max(0, gameState.scores[n].score - wrong)}○
                  </Button>
                  <Button
                    sx={{
                      color: "blue.600",
                      _dark: {
                        color: "blue.300",
                      },
                    }}
                    colorScheme="blue"
                    isDisabled={wrong >= 2}
                    onClick={() => onClickHandler("wrong", n)}
                    variant="ghost"
                  >
                    {wrong}✕
                  </Button>
                </Flex>
              );
            }
          )}
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <AQLBoardHeader
        end={end}
        game_id={game_id as string}
        logs={logs}
        name={game.name}
        onEndChange={() => setEnd((v) => !v)}
        quiz_offset={game.quiz.offset}
        quiz_set={game.quiz.set_name}
      />
      <Flex
        sx={{
          gap: "1.5vh 1vw",
          w: "100%",
          h: ["90vh", "90vh", "85vh"],
          px: "1vw",
          pt: "3vh",
          justifyContent: "space-around",
          flexDirection: ["column", "column", "row"],
        }}
        onKeyDown={keyboardShortcutHandler}
        tabIndex={-1}
      >
        <EachGroup position="left" />
        <EachGroup position="right" />
      </Flex>
      <Box sx={{ justifyContent: "center" }}>
        <GameLogs logs={logs} players={getPlayerList()} quiz={game.quiz} />
      </Box>
    </>
  );
};

export default AQLBoardPage;
