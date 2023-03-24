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
import { RuleNames } from "#/utils/db";
import { rules } from "#/utils/rules";
import { useNavigate } from "react-router-dom";

const RuleList: React.FC = () => {
  const navigate = useNavigate();
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name);
    navigate(`/${game_id}/config`);
  };

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
                <H3 p={0} whiteSpace="normal">
                  {rules[rule_name].name}
                </H3>
              </CardHeader>
              <CardBody>
                {`${description.slice(0, 50)}${
                  description.length > 50 ? "..." : ""
                }`}
              </CardBody>
              <CardFooter sx={{ justifyContent: "flex-end" }}>
                <Button
                  leftIcon={<CirclePlus />}
                  colorScheme="green"
                  size="sm"
                  onClick={() => onClick(rule_name)}
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
