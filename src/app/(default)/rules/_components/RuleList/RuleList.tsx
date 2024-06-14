"use client";

import { useRouter } from "next/navigation";

import { Box, Button, Card, Flex, Title } from "@mantine/core";
import { CirclePlus } from "tabler-icons-react";

import classes from "./RuleList.module.css";

import { createGame } from "@/utils/functions";
import { rules } from "@/utils/rules";
import { RuleNames } from "@/utils/types";

const RuleList: React.FC = () => {
  const router = useRouter();
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name);
    router.push(`/games/${game_id}/config`);
  };

  return (
    <Box>
      <Title order={2}>形式一覧</Title>
      <Box className={classes.rule_list_grid}>
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].short_description;
          return (
            <Card shadow="xs" key={rule_name} withBorder>
              <Card.Section
                withBorder
                inheritPadding
                className={classes.rule_name}
              >
                {rules[rule_name].name}
              </Card.Section>
              <Card.Section className={classes.rule_description}>
                {description}
              </Card.Section>
              <Flex className="justify-end">
                <Button
                  onClick={() => onClick(rule_name)}
                  size="sm"
                  leftSection={<CirclePlus />}
                >
                  作る
                </Button>
              </Flex>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default RuleList;
