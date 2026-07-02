"use client";

import { useMemo, useState } from "react";

import { Box, Button, Card, Group, Text, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconCirclePlus, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { CURRENT_PROFILE_STORAGE_KEY } from "@/utils/current-profile";
import { createGame, normalizeSearchText } from "@/utils/functions";
import { rules } from "@/utils/rules";

import classes from "./RuleList.module.css";

import type { RuleNames } from "@/utils/types";

type RuleListProps = {
  currentProfile: string;
};

const RuleList: React.FC<RuleListProps> = ({ currentProfile }) => {
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: currentProfile,
  });
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");

  const ruleNameList = Object.keys(rules) as RuleNames[];

  // 入力のたびに全形式の正規化・部分一致を再計算するため useMemo で結果をメモ化する
  const filteredRuleNameList = useMemo(() => {
    const query = normalizeSearchText(searchText);
    if (query === "") return ruleNameList;
    return ruleNameList.filter((rule_name) => {
      const rule = rules[rule_name];
      const target = normalizeSearchText(
        [
          rule.name,
          rule.rule,
          rule.short_description,
          rule.description,
          ...(rule.aliases ?? []),
        ].join(" ")
      );
      return target.includes(query);
    });
  }, [searchText, ruleNameList]);

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name, storedCurrentProfile);
    router.push(`/games/${game_id}/config`);
  };

  return (
    <>
      <Group justify="space-between" align="center" mb="lg" className={classes.rule_list_header}>
        <Title order={2}>形式一覧</Title>
        <TextInput
          className={classes.rule_search}
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
          placeholder="形式を検索"
          leftSection={<IconSearch size={18} />}
        />
      </Group>
      {filteredRuleNameList.length === 0 ? (
        <Text c="dimmed">該当する形式がありません。</Text>
      ) : (
        <Box className={classes.rule_list_grid}>
          {filteredRuleNameList.map((rule_name) => {
            const description = rules[rule_name].short_description;
            return (
              <Card shadow="xs" key={rule_name} withBorder>
                <Card.Section withBorder inheritPadding className={classes.rule_name}>
                  {rules[rule_name].name}
                </Card.Section>
                <Card.Section className={classes.rule_description}>{description}</Card.Section>
                <Group justify="flex-end">
                  <Button
                    onClick={() => onClick(rule_name)}
                    size="sm"
                    leftSection={<IconCirclePlus />}
                  >
                    作る
                  </Button>
                </Group>
              </Card>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default RuleList;
