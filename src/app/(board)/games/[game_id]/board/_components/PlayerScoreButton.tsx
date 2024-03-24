"use client";

import React, { useTransition } from "react";

import { Editable } from "@ark-ui/react";
import { SystemStyleObject } from "@pandacss/dev";

import { onScoreButtonClick } from "#/utils/actions";
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
  const [isPending, startTransition] = useTransition();
  const numberSign = children.endsWith("pt")
    ? "pt"
    : children.endsWith("○")
      ? "correct"
      : children.endsWith("✕")
        ? "wrong"
        : "none";

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
    _dark: {
      bgColor: filled ? variantDarkModeColor : "transparent",
      color: filled ? defaultDarkModeColor : variantDarkModeColor,
    },
    _hover: { opacity: disabled ? 1 : 0.5 },
    bgColor: filled ? variantLightModeColor : "transparent",
    borderRadius: 0,
    color: filled ? defaultLightModeColor : variantLightModeColor,
    cursor:
      disabled && color === "gray"
        ? "not-allowed"
        : disabled || color === "green" || editable
          ? "default"
          : "pointer",
    display: "block",
    fontSize: "3.5vw",
    fontWeight: 800,
    h: "100%",
    lg: {
      fontSize: "3rem",
      h: "4rem",
      w: compact ? "50%" : "100%",
    },
    lineHeight: "3rem",
    overflow: "hidden",
    textAlign: "center",
    w: compact ? "3.5rem" : "6rem",
    whiteSpace: "nowrap",
  };

  return (
    <>
      {editable ? (
        <Editable.Root activationMode="dblclick" placeholder="Placeholder">
          <Editable.Label>Label</Editable.Label>
          <Editable.Area>
            <Editable.Input
              className={css({
                lg: {
                  w: compact ? "calc(100% - 0.5rem)" : "calc(100% - 0.5rem)",
                },
                my: 1,
                p: 0,
                w: compact ? "2.5rem" : "5.5rem",
              })}
              defaultValue={children}
            />
            <Editable.Preview />
          </Editable.Area>
        </Editable.Root>
      ) : (
        <button
          className={css(buttonCssStyle)}
          disabled={isPending}
          onClick={() => {
            startTransition(() =>
              onScoreButtonClick({ color, game_id, player_id })
            );
          }}
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
        </button>
      )}
    </>
  );
};

export default PlayerScoreButton;
