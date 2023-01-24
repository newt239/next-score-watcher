import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Box,
  Button,
} from "@chakra-ui/react";
import { CirclePlus } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import { createGame } from "#/utils/commonFunctions";
import db, { RuleNames } from "#/utils/db";
import { rules } from "#/utils/rules";

const RuleList: React.FC = () => {
  const ruleNameList = Object.keys(rules) as RuleNames[];

  return (
    <Box pt={5}>
      <H2>形式一覧</H2>
      <SimpleGrid
        pt={5}
        spacing={5}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].description;
          return (
            <Card key={rule_name} variant="filled">
              <CardHeader>
                <H3 sx={{ p: 0 }}>{rules[rule_name].name}</H3>
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
                  onClick={() => createGame(rule_name)}
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
