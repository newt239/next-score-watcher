"use client";

import { useRouter } from "next/navigation";

import { Box, Button, Card, Group, Title } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

import classes from "./RuleList.module.css";

import type { RuleNames } from "@/utils/types";

import { createGame } from "@/utils/functions";
import { rules } from "@/utils/rules";

type RuleListProps = {
  currentProfile: string;
};

const RuleList: React.FC<RuleListProps> = ({ currentProfile }) => {
  const router = useRouter();
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name, currentProfile);
    router.push(`/games/${game_id}/config`);
  };

  return (
    <>
      <Title order={2}>形式一覧</Title>
      <Box className={classes.rule_list_grid}>
        {ruleNameList.map((rule_name) => {
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
    </>
  );
};

export default RuleList;
