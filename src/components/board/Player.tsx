import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, useColorMode } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtomValue } from "jotai";

import PlayerColorConfig from "~/components/board/PlayerColorConfig";
import PlayerHeader from "~/components/board/PlayerHeader";
import PlayerName from "~/components/board/PlayerName";
import PlayerScore from "~/components/board/PlayerScore";
import useDeviceWidth from "~/hooks/useDeviceWidth";
import db from "~/utils/db";
import { reversePlayerInfoAtom } from "~/utils/jotai";
import { rules } from "~/utils/rules";
import { ComputedScoreProps, PlayerDBProps, States } from "~/utils/types";

type PlayerProps = {
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreProps | undefined;
  isVerticalView: boolean;
};

const Player: React.FC<PlayerProps> = ({
  player,
  index,
  score,
  isVerticalView,
}) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const { colorMode } = useColorMode();
  const { game_id } = useParams();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );
  const [editableState, setEditableState] = useState<States>("playing");
  const isDesktop = useDeviceWidth();
  const reversePlayerInfo = useAtomValue(reversePlayerInfoAtom);

  useEffect(() => {
    if (score) {
      setEditableState(score.state || "playing");
    }
  }, [score]);

  if (!game || !score) return null;

  const rows = rules[game.rule].rows;

  const editedScore: ComputedScoreProps = {
    ...score,
    state: game.editable ? editableState : score.state,
  };

  const flexDirection =
    !isVerticalView && isDesktop
      ? reversePlayerInfo
        ? "column-reverse"
        : "column"
      : reversePlayerInfo
      ? "row-reverse"
      : "row";

  const getColor = (state: States) => {
    return state === "win"
      ? colorMode === "light"
        ? "red.600"
        : "red.300"
      : state == "lose"
      ? colorMode === "light"
        ? "blue.600"
        : "blue.300"
      : undefined;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection,
        justifyContent: "space-between",
        alignItems: "stretch",
        w: isDesktop
          ? isVerticalView
            ? "48vw"
            : `clamp(8vw, ${
                (98 - game.players.length) / game.players.length
              }vw, 15vw)`
          : "96vw",
        h: isDesktop ? (!isVerticalView ? "80vh" : "10vh") : undefined,
        backgroundColor: getColor(editedScore.state),
        color:
          getColor(editedScore.state) &&
          (colorMode === "light" ? "white" : "gray.800"),
        borderWidth: 3,
        borderStyle: "solid",
        borderColor:
          getColor(editedScore.state) ||
          getColor(editedScore.reach_state) ||
          (colorMode === "dark" ? "gray.700" : "gray.100"),
        borderRadius: "1rem",
        overflowX: "scroll",
        overflowY: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          w: isDesktop ? (isVerticalView ? "40vw" : "100%") : "100%",
          h:
            isDesktop && !isVerticalView
              ? `calc(80vh - ${rows * 4}rem)`
              : "100%",
          flexDirection: reversePlayerInfo ? "column-reverse" : "column",
          alignItems: !isVerticalView && isDesktop ? "center" : "flex-start",
          pl: !isVerticalView && isDesktop ? undefined : "0.5rem",
          overflowX: "hidden",
        }}
      >
        {game.editable ? (
          <PlayerColorConfig
            colorState={getColor(editedScore.state)}
            editableState={editableState}
            isVerticalView={isVerticalView}
            setEditableState={setEditableState}
          />
        ) : (
          <PlayerHeader
            belong={player.belong}
            index={index}
            isVerticalView={(isVerticalView && isDesktop) || !isDesktop}
            text={player.text}
          />
        )}
        <PlayerName
          isVerticalView={isVerticalView}
          player_name={player.name}
          rows={rows}
        />
      </Box>
      <PlayerScore
        game={game}
        isVerticalView={(isVerticalView && isDesktop) || !isDesktop}
        player={editedScore}
      />
    </Box>
  );
};

export default Player;
