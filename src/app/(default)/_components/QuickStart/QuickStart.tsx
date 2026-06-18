"use client";

import { useRef, useState } from "react";

import { ActionIcon, Anchor, Box, Button, NativeSelect, NumberInput, Select } from "@mantine/core";
import { IconArrowRight, IconMinus, IconPlus, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { z } from "zod";

import { MAX_PLAYER_COUNT } from "@/utils/functions";
import { getRuleStringByType, rules } from "@/utils/rules";

import classes from "./QuickStart.module.css";

import type { RuleNames } from "@/utils/types";

import type { NumberInputHandlers } from "@mantine/core";

const FIXED_PLAYER_COUNTS: Partial<Record<RuleNames, number>> = {
  attack25: 4,
  aql: 10,
};

const RuleSchema = z.custom<RuleNames>(
  (value) => typeof value === "string" && Object.prototype.hasOwnProperty.call(rules, value)
);

const QuickStart = () => {
  const [rule, setRule] = useState<RuleNames>("nomx");
  const [players, setPlayers] = useState<number>(5);
  const handlersRef = useRef<NumberInputHandlers>(null);

  const ruleOptions = Object.values(rules).map((r) => ({
    value: r.rule,
    label: r.rule === "normal" ? r.name : getRuleStringByType(r),
  }));

  const isPlayerCountFixed = typeof FIXED_PLAYER_COUNTS[rule] === "number";

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
          size="lg"
          value={rule}
          onChange={(value) => applyRule(value)}
        />
        <NativeSelect
          className={classes.rule_native_select}
          data={ruleOptions}
          label="形式"
          radius="md"
          size="lg"
          value={rule}
          onChange={(event) => applyRule(event.currentTarget.value)}
        />
        <NumberInput
          className={classes.player_input}
          classNames={{ input: classes.player_input_field }}
          clampBehavior="strict"
          disabled={isPlayerCountFixed}
          handlersRef={handlersRef}
          hideControls
          label="人数"
          leftSection={
            <ActionIcon
              aria-label="人数を減らす"
              disabled={isPlayerCountFixed || players <= 1}
              radius="md"
              size="lg"
              variant="subtle"
              onClick={() => handlersRef.current?.decrement()}
            >
              <IconMinus />
            </ActionIcon>
          }
          leftSectionPointerEvents="all"
          leftSectionWidth={48}
          max={MAX_PLAYER_COUNT}
          min={1}
          radius="md"
          rightSection={
            <ActionIcon
              aria-label="人数を増やす"
              disabled={isPlayerCountFixed || players >= MAX_PLAYER_COUNT}
              radius="md"
              size="lg"
              variant="subtle"
              onClick={() => handlersRef.current?.increment()}
            >
              <IconPlus />
            </ActionIcon>
          }
          rightSectionPointerEvents="all"
          rightSectionWidth={48}
          size="lg"
          value={players}
          onChange={(value) => setPlayers(typeof value === "number" ? value : 1)}
        />
      </Box>
      <Box className={classes.actions}>
        <Button
          component={Link}
          href={`/games/new?rule=${rule}&players=${players}`}
          radius="lg"
          rightSection={<IconArrowRight />}
          size="lg"
        >
          開始する
        </Button>
        <Anchor className={classes.detail_link} component={Link} href={`/games/new?rule=${rule}`}>
          <IconSettings size={18} />
          細かく設定する
        </Anchor>
      </Box>
    </Box>
  );
};

export default QuickStart;
