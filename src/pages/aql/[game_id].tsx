import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Flex,
  theme,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";

import AQLBoardHeader from "#/components/aql/AQLBoardHeader";
import GameLogs from "#/components/board/GameLogs";
import { AQLGameProps } from "#/components/home/OtherRules";
import { getConfig } from "#/hooks/useBooleanConfig";
import db from "#/utils/db";

type AQLPlayerStateProps = {
  score: number;
  wrong: number;
};

const AQLPage: NextPage = () => {
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const router = useRouter();
  const { game_id } = router.query;
  const aqlGamesRaw = localStorage.getItem("scorewatcher-aql-games");
  const game = aqlGamesRaw
    ? (JSON.parse(aqlGamesRaw) as { games: AQLGameProps[] }).games.find(
        (game) => game.id === game_id
      )
    : undefined;
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: game_id as string }).sortBy("timestamp"),
    []
  );
  const { colorMode } = useColorMode();

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
    await db.logs.put({
      id: nanoid(),
      game_id: game_id as string,
      player_id: String(n),
      variant,
      system: true,
      timestamp: cdate().text(),
    });
  };

  const gameState = getGameState();

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
      if (logs.length >= 40) {
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
          fontSize: "max(1.5rem, 2vw)",
          backgroundColor:
            state === "win"
              ? "red.500"
              : state === "lose"
              ? "blue.500"
              : undefined,
          p: 1,
          borderRadius: "1rem",
        }}
      >
        <div>{position === "left" ? game.left_team : game.right_team}</div>
        <div style={{ fontSize: "4.5rem" }}>
          {point}
          {state === "win" ? " / WIN" : state === "lose" ? " / LOSE" : ""}
        </div>
        <Flex sx={{ justifyContent: "space-between", gap: 1 }}>
          {(position === "left" ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9]).map(
            (n) => {
              const reachState =
                position === "left"
                  ? gameState.leftTeamReachStates[n]
                  : gameState.rightTeamReachStates[n - 5];
              const wrong =
                position === "left"
                  ? gameState.scores[n].wrong
                  : gameState.scores[n].wrong;
              return (
                <Flex
                  key={n}
                  sx={{
                    flexDirection: "column",
                    gap: 3,
                    borderStyle: "solid",
                    borderWidth: 2,
                    borderColor:
                      wrong === 1
                        ? "blue.500"
                        : reachState
                        ? "red.500"
                        : undefined,
                    borderRadius: "1rem",
                    p: 2,
                    backgroundColor:
                      wrong === 2
                        ? "blue.500"
                        : colorMode === "dark"
                        ? theme.colors.gray[800]
                        : "white",
                  }}
                >
                  <div>No. {position === "left" ? n + 1 : n - 4}</div>
                  <div style={{ fontSize: "3rem", fontWeight: 800 }}>
                    {gameState.scores[n].score}
                  </div>
                  <Button
                    onClick={() => onClickHandler("correct", n)}
                    sx={{ color: "red.500" }}
                    disabled={wrong === 2}
                  >
                    ○
                  </Button>
                  <Button
                    onClick={() => onClickHandler("wrong", n)}
                    sx={{ color: "blue.500" }}
                    disabled={wrong === 2}
                  >
                    {wrong !== 0 && wrong}✕
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
      <Head>
        <title>AQL rule - Score Watcher</title>
      </Head>
      <AQLBoardHeader
        name={game.name}
        game_id={game_id as string}
        logs={logs}
        quiz_set={game.quiz.set_name}
        quiz_offset={game.quiz.offset}
      />
      <Flex
        sx={{
          p: 5,
          justifyContent: "space-around",
          flexDirection: isLargerThan800 ? "row" : "column",
        }}
      >
        <EachGroup position="left" />
        <EachGroup position="right" />
      </Flex>
      {getConfig("scorewatcher-show-logs") && (
        <Flex sx={{ justifyContent: "center" }}>
          <GameLogs players={getPlayerList()} logs={logs} />
        </Flex>
      )}
    </>
  );
};

export default AQLPage;
