import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useColorMode, theme, Flex, Box } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtomValue } from "jotai";

import PlayerColorConfig from "./PlayerColorConfig";
import PlayerHeader from "./PlayerHeader";

import PlayerName from "#/components/board/PlayerName";
import PlayerScore from "#/components/board/PlayerScore";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import { getConfig } from "#/hooks/useLocalStorage";
import db, { ComputedScoreDBProps, PlayerDBProps, States } from "#/utils/db";
import { verticalViewAtom } from "#/utils/jotai";

type PlayerProps = {
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreDBProps | undefined;
  qn: number;
  last_correct_player: string;
};

const Player: React.FC<PlayerProps> = ({
  player,
  index,
  score,
  qn,
  last_correct_player,
}) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const [editableState, setEditableState] = useState<States>("playing");

  const isDesktop = useDeviceWidth();
  const isVerticalView = useAtomValue(verticalViewAtom);

  useEffect(() => {
    if (score) {
      setEditableState(score.state || "playing");
    }
  }, [score]);

  if (!game || !score) return null;

  const editedScore: ComputedScoreDBProps = {
    ...score,
    state: game.editable ? editableState : score.state,
  };

  const flexDirection =
    !isVerticalView && isDesktop
      ? getConfig("scorewatcher-reverse-player-info", false)
        ? "column-reverse"
        : "column"
      : getConfig("scorewatcher-reverse-player-info", false)
      ? "row-reverse"
      : "row";

  const getColor = (state: States) => {
    return state === "win"
      ? theme.colors.red[500]
      : state == "lose"
      ? theme.colors.blue[500]
      : undefined;
  };

  return (
    <Flex
      sx={{
        flexDirection,
        justifyContent: "space-between",
        alignItems: "stretch",
        minW: "10vw",
        w: isVerticalView && isDesktop ? "45vw" : undefined,
        backgroundColor: getColor(editedScore.state),
        color:
          getColor(editedScore.state) &&
          (colorMode === "light" ? "white" : theme.colors.gray[800]),
        borderWidth: !isVerticalView && isDesktop ? 3 : 1,
        borderStyle: "solid",
        borderColor:
          getColor(editedScore.state) ||
          getColor(editedScore.reachState) ||
          (colorMode === "dark"
            ? theme.colors.gray[700]
            : theme.colors.gray[50]),
        borderRadius: !isVerticalView && isDesktop ? "1rem" : "0.5rem",
        overflowX: !isVerticalView && isDesktop ? undefined : "scroll",
        overflowY: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      <Flex
        sx={{
          flexGrow: 1,
          flexDirection: getConfig("scorewatcher-reverse-player-info", false)
            ? "column-reverse"
            : "column",
          alignItems: !isVerticalView && isDesktop ? "center" : "flex-start",
          paddingLeft: !isVerticalView && isDesktop ? undefined : "0.5rem",
        }}
      >
        {game.editable ? (
          <Box
            sx={{
              margin: !isVerticalView && isDesktop ? "auto" : undefined,
            }}
          >
            <PlayerColorConfig
              colorState={getColor(editedScore.state)}
              editableState={editableState}
              setEditableState={setEditableState}
            />
          </Box>
        ) : (
          <PlayerHeader
            index={index}
            text={player.text}
            belong={player.belong}
          />
        )}
        <PlayerName player_name={player.name} />
      </Flex>
      <PlayerScore
        game={game}
        player_id={player.id}
        player={editedScore}
        qn={qn}
        isLastCorrectPlayer={
          last_correct_player === player.id &&
          qn !== 0 &&
          score.last_wrong < score.last_correct
        }
      />
    </Flex>
  );
};

export default Player;
