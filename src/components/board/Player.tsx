import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useColorMode, theme, useMediaQuery, Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerColorConfig from "./PlayerColorConfig";
import PlayerHeader from "./PlayerHeader";

import PlayerName from "#/components/board/PlayerName";
import PlayerScore from "#/components/board/PlayerScore";
import db, { ComputedScoreDBProps, PlayerDBProps, States } from "#/utils/db";

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

  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

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

  const getColor = (state: States) => {
    return state === "win"
      ? theme.colors.red[500]
      : state == "lose"
      ? theme.colors.blue[500]
      : undefined;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isLargerThan700 ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        backgroundColor: getColor(editedScore.state),
        color:
          getColor(editedScore.state) &&
          (colorMode === "light" ? "white" : theme.colors.gray[800]),
        borderWidth: isLargerThan700 ? 3 : 1,
        borderStyle: "solid",
        borderColor:
          getColor(editedScore.state) ||
          getColor(editedScore.reachState) ||
          (colorMode === "dark"
            ? theme.colors.gray[700]
            : theme.colors.gray[50]),
        borderRadius: isLargerThan700 ? "1rem" : "0.5rem",
        overflowX: isLargerThan700 ? undefined : "scroll",
        overflowY: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      <Flex
        sx={{
          flexGrow: 1,
          flexDirection: "column",
          paddingLeft: isLargerThan700 ? undefined : "0.5rem",
        }}
      >
        <PlayerHeader index={index} text={player.text} belong={player.belong} />
        <PlayerName player_name={player.name} />
      </Flex>
      {game.editable && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PlayerColorConfig
            colorState={getColor(editedScore.state)}
            editableState={editableState}
            setEditableState={setEditableState}
          />
        </div>
      )}
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
    </div>
  );
};

export default Player;
