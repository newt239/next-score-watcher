import router from "next/router";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Box,
  Button,
} from "@chakra-ui/react";

import H2 from "#/blocks/H2";
import db, { GameDBProps, RuleNames } from "#/utils/db";
import { rules } from "#/utils/state";

const RuleList: React.FC = () => {
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const createGame = async (rule: RuleNames) => {
    try {
      const putData: GameDBProps = {
        name: rules[rule].name,
        count: 3,
        rule,
        correct_me: 1,
        wrong_me: -1,
      };
      switch (rule) {
        case "nomx":
          putData.win_point = rules[rule].win_point;
          putData.lose_point = rules[rule].lose_point;
          break;
        case "nbyn":
          putData.win_point = rules[rule].win_point;
          break;
        case "nupdown":
          putData.win_point = rules[rule].win_point;
          putData.lose_point = rules[rule].lose_point;
          break;
        case "swedishx":
          putData.win_point = rules[rule].win_point;
          break;
        case "attacksurvival":
          putData.win_point = rules[rule].win_point;
          putData.win_through = rules[rule].win_through;
          putData.correct_me = rules[rule].correct_me;
          putData.wrong_me = rules[rule].wrong_me;
          putData.correct_other = rules[rule].correct_other;
          putData.wrong_other = rules[rule].wrong_other;
          break;
        case "squarex":
          putData.win_point = rules[rule].win_point;
          break;
      }
      router.push(`/${await db.games.put(putData)}/config`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box pt={5}>
      <H2>形式一覧</H2>
      <SimpleGrid
        pt={5}
        spacing={5}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {ruleNameList.map((id) => (
          <Card key={id} variant="filled">
            <CardHeader>{rules[id].name}</CardHeader>
            <CardBody>{rules[id].description}</CardBody>
            <CardFooter sx={{ justifyContent: "flex-end" }}>
              <Button colorScheme="blue" onClick={() => createGame(id)}>
                新規作成
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RuleList;
