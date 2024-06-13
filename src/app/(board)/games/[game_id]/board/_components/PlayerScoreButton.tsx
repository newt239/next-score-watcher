"use client";

import React, { CSSProperties, useId } from "react";

import { Button } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import db from "@/utils/db";
import { isDesktop } from "@/utils/functions";

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

  const ButtonCssStyle: CSSProperties = {
    display: "block",
    fontSize: isDesktop()
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
    width: isDesktop()
      ? compact
        ? "50%"
        : "100%"
      : compact
      ? "3.5rem"
      : "6rem",
    height: "4rem",
    textAlign: "center",
    borderRadius: 0,
    backgroundColor: filled ? variantColor : "teal",
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
    <Button onClick={onClick || handleClick} style={ButtonCssStyle}>
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
  );
};

export default PlayerScoreButton;
