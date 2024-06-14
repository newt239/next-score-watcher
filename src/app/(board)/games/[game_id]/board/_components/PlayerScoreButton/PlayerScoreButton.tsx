"use client";

import React, { CSSProperties, useId } from "react";

import { UnstyledButton } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import classes from "./PlayerScoreButton.module.css";

import db from "@/utils/db";

type Props = {
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

const PlayerScoreButton: React.FC<Props> = ({
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
  const numberSign = children.endsWith("pt")
    ? "pt"
    : children.endsWith("○")
    ? "correct"
    : children.endsWith("✕")
    ? "wrong"
    : "none";
  const id = useId();
  const colorMode = useColorScheme();

  const defaultColor = colorMode === "light" ? "white" : "gray.8";
  const variantColor =
    color === "gray"
      ? "gray.3"
      : ["red", "win"].includes(color)
      ? colorMode === "light"
        ? "red.6"
        : "red.3"
      : ["blue", "lose"].includes(color)
      ? colorMode === "light"
        ? "blue.6"
        : "blue.3"
      : colorMode === "light"
      ? "green.6"
      : "yellow.3";

  const ButtonCssStyle: CSSProperties = {
    backgroundColor: filled ? variantColor : "transparent",
    color: filled ? defaultColor : variantColor,
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
        await db().logs.put({
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
    <UnstyledButton
      onClick={onClick || handleClick}
      className={classes.player_score_button}
      style={ButtonCssStyle}
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
    </UnstyledButton>
  );
};

export default PlayerScoreButton;
