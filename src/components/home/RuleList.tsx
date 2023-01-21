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
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import db, { GameDBProps, RuleNames } from "#/utils/db";
import { rules } from "#/utils/rules";

const RuleList: React.FC = () => {
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const createGame = async (rule: RuleNames) => {
    try {
      const putData: GameDBProps = {
        id: nanoid(6),
        name: rules[rule].name,
        players: [],
        rule,
        correct_me: 1,
        wrong_me: -1,
        editable: false,
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
        case "z":
          putData.win_point = 10;
          break;
        case "freezx":
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
        {ruleNameList.map((id) => {
          const description = rules[id].description;
          return (
            <Card key={id} variant="filled">
              <CardHeader>
                <H3 sx={{ p: 0 }}>{rules[id].name}</H3>
              </CardHeader>
              <CardBody>
                {`${description.slice(0, 50)}${
                  description.length > 50 ? "..." : ""
                }`}
              </CardBody>
              <CardFooter sx={{ justifyContent: "flex-end" }}>
                <Button
                  leftIcon={<CirclePlus />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => createGame(id)}
                >
                  作る
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default RuleList;