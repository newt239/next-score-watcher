import React, { useId } from "react";

import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  SystemStyleObject,
  useColorMode,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import useDeviceWidth from "~/hooks/useDeviceWidth";
import db from "~/utils/db";
import { recordEvent } from "~/utils/ga4";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green" | "gray" | "win" | "lose" | "playing";
  filled?: boolean;
  compact?: boolean;
  game_id: string;
  player_id: string;
  editable: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: string;
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
  onClick,
}) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const numberSign = children.endsWith("pt")
    ? "pt"
    : children.endsWith("○")
    ? "correct"
    : children.endsWith("✕")
    ? "wrong"
    : "none";
  const id = useId();
  const { colorMode } = useColorMode();
  const isDesktop = useDeviceWidth();

  const defaultColor = colorMode === "light" ? "white" : "gray.800";
  const variantColor =
    color === "gray"
      ? "gray.300"
      : ["red", "win"].includes(color)
      ? colorMode === "light"
        ? "red.600"
        : "red.300"
      : ["blue", "lose"].includes(color)
      ? colorMode === "light"
        ? "blue.600"
        : "blue.300"
      : colorMode === "light"
      ? "green.600"
      : "yellow.300";

  const ButtonCssStyle: SystemStyleObject = {
    display: "block",
    fontSize: isDesktop
      ? `clamp(1.5rem, calc(${compact ? "5vw" : "10vw"} / ${Math.max(
          children.length - (numberSign !== "none" ? 1 : 0),
          2
        )}), 3rem)`
      : `max(1.5rem, min(calc(${compact ? "6vw" : "12vw"} / ${Math.max(
          children.length - (numberSign !== "none" ? 1 : 0),
          2
        )}), 3.5vw))`,
    fontWeight: 800,
    lineHeight: "3rem",
    w: isDesktop ? (compact ? "50%" : "100%") : compact ? "3.5rem" : "6rem",
    h: "4rem",
    textAlign: "center",
    borderRadius: 0,
    bgColor: filled ? variantColor : "transparent",
    color: filled ? defaultColor : variantColor,
    whiteSpace: "nowrap",
    overflow: "hidden",
    cursor:
      disabled && color === "gray"
        ? "not-allowed"
        : disabled || color === "green" || editable
        ? "default"
        : "pointer",
  };

  const handleClick = async () => {
    if (color !== "green" && !disabled) {
      try {
        await db(currentProfile).logs.put({
          id: nanoid(),
          game_id,
          player_id,
          variant: color === "red" ? "correct" : "wrong",
          system: false,
          timestamp: cdate().text(),
        });
        recordEvent({
          action: "click_score_button",
          category: "engagement",
          label: game_id,
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
          sx={{ ...ButtonCssStyle, h: "auto" }}
        >
          <EditablePreview my={1} p={0} />
          <EditableInput
            id={id}
            name={id}
            sx={{
              p: 0,
              my: 1,
              w: isDesktop
                ? compact
                  ? "calc(100% - 0.5rem)"
                  : "calc(100% - 0.5rem)"
                : compact
                ? "2.5rem"
                : "5.5rem",
            }}
          />
        </Editable>
      ) : (
        <Button
          _hover={{ opacity: disabled ? 1 : 0.5 }}
          onClick={onClick || handleClick}
          sx={ButtonCssStyle}
          variant="unstyled"
        >
          {numberSign === "none" ? (
            children
          ) : (
            <>
              <span>{children.split(/((?:○)|(?:✕)|(?:pt))/)[0]}</span>
              <span style={{ fontSize: "75%" }}>
                {children.split(/((?:○)|(?:✕)|(?:pt))/)[1]}
              </span>
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default PlayerScoreButton;
