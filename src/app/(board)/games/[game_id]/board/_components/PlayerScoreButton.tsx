import React, { useId } from "react";

import { Editable } from "@ark-ui/react";
import { SystemStyleObject } from "@pandacss/dev";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import db from "#/utils/db";
import { css } from "@panda/css";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green" | "gray" | "win" | "lose" | "playing";
  filled?: boolean;
  compact?: boolean;
  game_id: string;
  player_id: string;
  editable: boolean;
  disabled?: boolean;
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
}) => {
  const numberSign = children.endsWith("pt")
    ? "pt"
    : children.endsWith("○")
      ? "correct"
      : children.endsWith("✕")
        ? "wrong"
        : "none";
  const id = useId();

  const defaultLightModeColor = "white";
  const defaultDarkModeColor = "gray.800";
  const variantLightModeColor =
    color === "gray"
      ? "gray.300"
      : ["red", "win"].includes(color)
        ? "red.600"
        : ["blue", "lose"].includes(color)
          ? "blue.600"
          : "green.600";
  const variantDarkModeColor =
    color === "gray"
      ? "gray.300"
      : ["red", "win"].includes(color)
        ? "red.300"
        : ["blue", "lose"].includes(color)
          ? "blue.300"
          : "yellow.300";

  const buttonCssStyle: SystemStyleObject = {
    display: "block",
    fontSize: "3.5vw",
    fontWeight: 800,
    lineHeight: "3rem",
    w: compact ? "3.5rem" : "6rem",
    h: "100%",
    textAlign: "center",
    borderRadius: 0,
    bgColor: filled ? variantLightModeColor : "transparent",
    color: filled ? defaultLightModeColor : variantLightModeColor,
    whiteSpace: "nowrap",
    overflow: "hidden",
    cursor:
      disabled && color === "gray"
        ? "not-allowed"
        : disabled || color === "green" || editable
          ? "default"
          : "pointer",
    _dark: {
      bgColor: filled ? variantDarkModeColor : "transparent",
      color: filled ? defaultDarkModeColor : variantDarkModeColor,
    },
    lg: {
      fontSize: "3rem",
      w: compact ? "50%" : "100%",
      h: "4rem",
    },
    _hover: { opacity: disabled ? 1 : 0.5 },
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
        <Editable.Root activationMode="dblclick" placeholder="Placeholder">
          <Editable.Label>Label</Editable.Label>
          <Editable.Area>
            <Editable.Input
              className={css({
                p: 0,
                my: 1,
                w: compact ? "2.5rem" : "5.5rem",
                lg: {
                  w: compact ? "calc(100% - 0.5rem)" : "calc(100% - 0.5rem)",
                },
              })}
              defaultValue={children}
            />
            <Editable.Preview />
          </Editable.Area>
        </Editable.Root>
      ) : (
        <button className={css(buttonCssStyle)} onClick={handleClick}>
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
        </button>
      )}
    </>
  );
};

export default PlayerScoreButton;
