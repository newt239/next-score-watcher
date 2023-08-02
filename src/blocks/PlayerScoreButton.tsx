import { useId } from "react";

import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  SystemStyleObject,
  theme,
  useColorMode,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";

import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { verticalViewAtom } from "#/utils/jotai";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green" | "gray" | "win" | "lose" | "playing";
  children: string;
  filled?: boolean;
  compact?: boolean;
  game_id: string;
  player_id: string;
  editable: boolean;
  disabled?: boolean;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  color,
  children,
  filled = false,
  compact = false,
  game_id,
  player_id,
  editable,
  disabled,
}) => {
  const id = useId();
  const { colorMode } = useColorMode();
  const desktop = useDeviceWidth();
  const isVerticalView = useAtomValue(verticalViewAtom);

  const defaultColor = colorMode === "light" ? "white" : theme.colors.gray[800];
  const variantColor =
    color === "gray"
      ? theme.colors.gray[300]
      : ["red", "win"].includes(color)
      ? theme.colors.red[colorMode === "light" ? 600 : 300]
      : ["blue", "lose"].includes(color)
      ? theme.colors.blue[colorMode === "light" ? 600 : 300]
      : colorMode === "light"
      ? theme.colors.green[600]
      : theme.colors.yellow[300];

  const ButtonCssStyle: SystemStyleObject = {
    fontSize: desktop
      ? `clamp(24px, calc(${compact ? "5vw" : "10vw"} / ${children.length}), ${
          compact || isVerticalView ? "4.5vw" : "48px"
        })`
      : `max(1.5rem, min(calc(${compact ? "6vw" : "12vw"} / ${
          children.length
        }), 3.5vw))`,
    fontWeight: 800,
    lineHeight: desktop ? "4vw" : "max(3vw, 1rem)",
    w: "100%",
    h: "100%",
    m: "auto",
    textAlign: "center",
    borderRadius: 0,
    bgColor: filled ? variantColor : "transparent",
    color: filled ? defaultColor : variantColor,
    whiteSpace: "nowrap",
    overflow: "hidden",
    cursor: disabled || color === "green" || editable ? "default" : "pointer",
  };

  const handleClick = async () => {
    if (color !== "green" && !disabled) {
      try {
        await db.logs.put({
          id: nanoid(),
          game_id,
          player_id,
          variant: color === "red" ? "correct" : "wrong",
          system: false,
          timestamp: cdate().text(),
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {editable ? (
        <Editable
          alignItems="center"
          defaultValue={children}
          display="flex"
          justifyContent="center"
          sx={ButtonCssStyle}
        >
          <EditablePreview p={0} />
          <EditableInput id={id} maxW="5vw" name={id} p={0} w="100%" />
        </Editable>
      ) : (
        <Button
          _hover={{ opacity: disabled ? 1 : 0.5 }}
          display="block"
          onClick={handleClick}
          sx={ButtonCssStyle}
          variant="unstyled"
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default PlayerScoreButton;
