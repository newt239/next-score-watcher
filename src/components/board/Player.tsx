import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Flex, theme, useColorMode } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtomValue } from "jotai";

import PlayerColorConfig from "#/components/board/PlayerColorConfig";
import PlayerHeader from "#/components/board/PlayerHeader";
import PlayerName from "#/components/board/PlayerName";
import PlayerScore from "#/components/board/PlayerScore";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { reversePlayerInfoAtom, verticalViewAtom } from "#/utils/jotai";
import { rules } from "#/utils/rules";
import { ComputedScoreProps, PlayerDBProps, States } from "#/utils/types";

type PlayerProps = {
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreProps | undefined;
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
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const [editableState, setEditableState] = useState<States>("playing");
  const isDesktop = useDeviceWidth();
  const isVerticalView = useAtomValue(verticalViewAtom);
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
      ? theme.colors.red[colorMode === "light" ? 600 : 300]
      : state == "lose"
      ? theme.colors.blue[colorMode === "light" ? 600 : 300]
      : undefined;
  };

  return (
    <Flex
      sx={{
        flexDirection,
        justifyContent: "space-between",
        alignItems: "stretch",
        w: isDesktop
          ? isVerticalView
            ? "48vw"
            : `clamp(8vw, ${
                (98 - game.players.length) / game.players.length
              }vw, 15vw)`
          : "100%",
        h: isDesktop ? (!isVerticalView ? "80vh" : "10vh") : undefined,
        backgroundColor: getColor(editedScore.state),
        color:
          getColor(editedScore.state) &&
          (colorMode === "light" ? "white" : theme.colors.gray[800]),
        borderWidth: 3,
        borderStyle: "solid",
        borderColor:
          getColor(editedScore.state) ||
          getColor(editedScore.reach_state) ||
          (colorMode === "dark"
            ? theme.colors.gray[700]
            : theme.colors.gray[50]),
        borderRadius: "1rem",
        overflowX: "scroll",
        overflowY: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      <Flex
        sx={{
          flexGrow: 1,
          w: !isDesktop || isVerticalView ? "40vw" : "100%",
          h:
            isDesktop && !isVerticalView
              ? `calc(100% - ${rows * 2}vh)`
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
            setEditableState={setEditableState}
          />
        ) : (
          <PlayerHeader
            belong={player.belong}
            index={index}
            text={player.text}
          />
        )}
        <PlayerName player_name={player.name} />
      </Flex>
      <PlayerScore
        game={game}
        isLastCorrectPlayer={
          last_correct_player === player.id &&
          qn !== 0 &&
          score.last_wrong < score.last_correct
        }
        player={editedScore}
        player_id={player.id}
        qn={qn}
      />
    </Flex>
  );
};

export default Player;
