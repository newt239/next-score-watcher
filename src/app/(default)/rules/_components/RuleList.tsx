"use client";

import { Box, Button, Flex, Paper, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { CirclePlus } from "tabler-icons-react";

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
      <Box
        className="grid gap-3 pt-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].short_description;
          return (
            <Paper
              shadow="xs"
              className="grid bg-gray-200 p-3 pb-0"
              style={{
                gridTemplateRows: "subgrid",
                gridRow: "span 4",
              }}
              key={rule_name}
            >
              <Title order={4}>{rules[rule_name].name}</Title>
              <Box>{description}</Box>
              <Flex className="justify-end">
                <Button
                  onClick={() => onClick(rule_name)}
                  size="sm"
                  leftSection={<CirclePlus />}
                >
                  作る
                </Button>
              </Flex>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default RuleList;
