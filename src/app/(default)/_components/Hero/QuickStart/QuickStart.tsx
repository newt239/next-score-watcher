"use client";

import { useState } from "react";

import { Anchor, Box, Button, NativeSelect, NumberInput, Select } from "@mantine/core";
import { IconArrowRight, IconSettings } from "@tabler/icons-react";
import { z } from "zod";

import ClientLink from "@/components/ClientLink/ClientLink";
import { MAX_PLAYER_COUNT } from "@/utils/functions";
import { rules } from "@/utils/rules";

import classes from "./QuickStart.module.css";

import type { RuleNames } from "@/utils/types";

/** 形式ごとに人数を固定する場合の値。指定がない形式は任意の人数を選べる */
const FIXED_PLAYER_COUNTS: Partial<Record<RuleNames, number>> = {
  attack25: 4,
  aql: 10,
};

/** rules に存在する形式名のみ受け付けるスキーマ */
const RuleSchema = z.custom<RuleNames>(
  (value) => typeof value === "string" && Object.prototype.hasOwnProperty.call(rules, value)
);

/** 形式と人数を選んでワンクリックでゲームを開始するヒーロー内のクイックスタートカード */
const QuickStart = () => {
  const [rule, setRule] = useState<RuleNames>("nomx");
  const [players, setPlayers] = useState<number>(5);

  const ruleOptions = Object.values(rules).map((r) => ({
    value: r.rule,
    label: r.name,
  }));

  const isPlayerCountFixed = typeof FIXED_PLAYER_COUNTS[rule] === "number";

  /** 選択された形式を検証して state を更新し、固定人数形式なら人数も同期する */
  const applyRule = (value: string | null) => {
    const result = RuleSchema.safeParse(value);
    if (!result.success) return;
    setRule(result.data);
    const fixed = FIXED_PLAYER_COUNTS[result.data];
    if (typeof fixed === "number") setPlayers(fixed);
  };

  return (
    <Box className={classes.card}>
      <Box className={classes.card_title}>得点表示を作る</Box>
      <Box className={classes.inputs}>
        <Select
          allowDeselect={false}
          className={classes.rule_select}
          data={ruleOptions}
          label="形式"
          radius="md"
          value={rule}
          onChange={(value) => applyRule(value)}
        />
        <NativeSelect
          className={classes.rule_native_select}
          data={ruleOptions}
          label="形式"
          radius="md"
          value={rule}
          onChange={(event) => applyRule(event.currentTarget.value)}
        />
        <NumberInput
          className={classes.player_input}
          clampBehavior="strict"
          disabled={isPlayerCountFixed}
          label="人数"
          max={MAX_PLAYER_COUNT}
          min={1}
          radius="md"
          value={players}
          onChange={(value) => setPlayers(typeof value === "number" ? value : 1)}
        />
      </Box>
      <Box className={classes.actions}>
        <Button
          component={ClientLink}
          href={`/games/new?rule=${rule}&players=${players}`}
          radius="lg"
          rightSection={<IconArrowRight />}
          size="md"
        >
          開始する
        </Button>
        <Anchor
          className={classes.detail_link}
          component={ClientLink}
          href={`/games/new?rule=${rule}`}
        >
          <IconSettings size={16} />
          細かく設定する
        </Anchor>
      </Box>
    </Box>
  );
};

export default QuickStart;
