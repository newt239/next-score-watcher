"use client";

import { useState } from "react";

import { Anchor, Box, Button, NumberInput, Select } from "@mantine/core";
import { IconArrowRight, IconSettings } from "@tabler/icons-react";

import ClientLink from "@/components/ClientLink/ClientLink";
import { MAX_PLAYER_COUNT } from "@/utils/functions";
import { rules } from "@/utils/rules";

import classes from "./QuickStart.module.css";

/** 形式と人数を選んでワンクリックでゲームを開始するヒーロー内のクイックスタートカード */
const QuickStart = () => {
  const [rule, setRule] = useState("nomx");
  const [players, setPlayers] = useState<number>(5);

  const ruleOptions = Object.values(rules).map((r) => ({
    value: r.rule,
    label: r.name,
  }));

  return (
    <Box className={classes.card}>
      <Box className={classes.card_title}>得点表示を作る</Box>
      <Select
        allowDeselect={false}
        data={ruleOptions}
        label="形式"
        radius="md"
        value={rule}
        onChange={(value) => value && setRule(value)}
      />
      <NumberInput
        clampBehavior="strict"
        label="人数"
        max={MAX_PLAYER_COUNT}
        min={1}
        radius="md"
        value={players}
        onChange={(value) => setPlayers(typeof value === "number" ? value : 1)}
      />
      <Button
        component={ClientLink}
        href={`/games/new?rule=${rule}&players=${players}`}
        radius="lg"
        rightSection={<IconArrowRight />}
        size="md"
      >
        開始する
      </Button>
      <Anchor className={classes.detail_link} component={ClientLink} href="/rules">
        <IconSettings size={16} />
        細かく設定する
      </Anchor>
    </Box>
  );
};

export default QuickStart;
