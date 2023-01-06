import { useRouter } from "next/router";
import { useState } from "react";

import {
  Popover,
  Stack,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  RadioGroup,
  Radio,
  IconButton,
  Box,
  PopoverArrow,
  PopoverHeader,
  useColorMode,
  theme,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { Edit } from "tabler-icons-react";

import PlayerScore from "#/components/board/PlayerScore";
import db, { ComputedScoreDBProps, PlayerDBProps, States } from "#/utils/db";

interface PlayerProps {
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreDBProps | undefined;
  qn: number;
}

const Player: React.FC<PlayerProps> = ({ player, index, score, qn }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const [editableState, setEditableState] = useState<States>(
    score?.state || "playing"
  );

  if (!game || !score) {
    return null;
  }

  const getColor = (state: States) => {
    const newState = game.editable ? editableState : state;
    return newState === "win"
      ? theme.colors.red[500]
      : newState == "lose"
      ? theme.colors.blue[500]
      : undefined;
  };

  const PlayerName = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        height: "50vh",
        margin: "auto",
        paddingTop: 10,
      }}
    >
      <Box
        style={{
          writingMode: "vertical-rl",
          whiteSpace: "nowrap",
          textOrientation: "upright",
          fontSize: "clamp(9vh, 2.5rem, 9vw)",
          fontWeight: 800,
        }}
      >
        {player.name}
      </Box>
      {game.editable && (
        <Box sx={{ color: colorMode === "light" ? "black" : "white" }}>
          <Popover>
            <PopoverTrigger>
              <IconButton
                size="sm"
                variant="ghost"
                colorScheme={getColor(score.state)}
                color={
                  getColor(score.state) &&
                  (colorMode === "light" ? "white" : theme.colors.gray[800])
                }
                icon={<Edit />}
                aria-label="override player state"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>背景色を変更</PopoverHeader>
              <PopoverBody>
                <RadioGroup
                  value={editableState}
                  onChange={(newState: States) => setEditableState(newState)}
                >
                  <Stack spacing={5} direction="row">
                    <Radio value="playing">デフォルト</Radio>
                    <Radio value="win">赤</Radio>
                    <Radio value="lose">青</Radio>
                  </Stack>
                </RadioGroup>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      )}
    </div>
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: getColor(score.state),
        color:
          getColor(score.state) &&
          (colorMode === "light" ? "white" : theme.colors.gray[800]),
        borderWidth: 1,
        borderStyle: "solid",
        borderColor:
          getColor(score.state) &&
          (colorMode === "light" ? "white" : theme.colors.gray[800]),
        borderRadius: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 5,
          fontWeight: 800,
        }}
      >
        <div>{index + 1}</div>
        <div>{player.belong !== "" ? player.belong : "―――――"}</div>
      </div>
      <PlayerName />

      {score ? (
        <PlayerScore
          game={game}
          player_id={Number(player.id)}
          score={score}
          qn={qn}
        />
      ) : (
        <div>ERR!</div>
      )}
    </div>
  );
};

export default Player;
