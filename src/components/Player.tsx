import { useRouter } from "next/router";
import { useState } from "react";

import { EditIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverAnchor,
  Stack,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  RadioGroup,
  Radio,
  IconButton,
  useDisclosure,
  Box,
  PopoverArrow,
  PopoverHeader,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerScore from "#/components/PlayerScore";
import db, { ComputedScoreDBProps, PlayerDBProps, States } from "#/utils/db";

interface PlayerProps {
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreDBProps | undefined;
}

const Player: React.FC<PlayerProps> = ({ player, index, score }) => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [editableState, setEditableState] = useState<States>("playing");

  if (!game || !logs || !score) {
    return null;
  }

  const getColor = (state: States) => {
    const newState = game.editable ? editableState : state;
    return newState === "win"
      ? "#db2828"
      : newState == "lose"
      ? "#2185d0"
      : undefined;
  };

  const PlayerName = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        height: "50vh",
        margin: "auto",
      }}
    >
      <Box
        style={{
          writingMode: "vertical-rl",
          whiteSpace: "nowrap",
          textOrientation: "upright",
          fontSize: "clamp(8vh, 2rem, 8vw)",
          fontWeight: 800,
        }}
      >
        {player.name}
      </Box>
      {game.editable && (
        <Box sx={{ color: "black" }}>
          <Popover>
            <PopoverTrigger>
              <IconButton
                size="sm"
                variant="ghost"
                colorScheme={getColor(score.state)}
                color={getColor(score.state) && "white"}
                icon={<EditIcon />}
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
        color: getColor(score.state) && "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 5,
        }}
      >
        <div>{index + 1}</div>
        <div>{player.belong !== "" ? player.belong : "―――――"}</div>
      </div>
      <PlayerName />

      {score ? (
        <PlayerScore game={game} player_id={Number(player.id)} score={score} />
      ) : (
        <div>ERR!</div>
      )}
    </div>
  );
};

export default Player;
