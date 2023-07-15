import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  SimpleGrid,
} from "@chakra-ui/react";
import { CirclePlus } from "tabler-icons-react";

import { createGame } from "#/utils/functions";
import { rules } from "#/utils/rules";
import { RuleNames } from "#/utils/types";

const RuleList: React.FC = () => {
  const navigate = useNavigate();
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name);
    navigate(`/${game_id}/config`);
  };

  return (
    <Box pt={5}>
      <h2>形式一覧</h2>
      <SimpleGrid
        pt={5}
        spacing={5}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].description;
          return (
            <Card key={rule_name} size="sm" variant="filled">
              <CardHeader>
                <h3 className="p0">{rules[rule_name].name}</h3>
              </CardHeader>
              <CardBody>
                {`${description.slice(0, 50)}${
                  description.length > 50 ? "..." : ""
                }`}
              </CardBody>
              <CardFooter sx={{ justifyContent: "flex-end" }}>
                <Button
                  colorScheme="green"
                  leftIcon={<CirclePlus />}
                  onClick={() => onClick(rule_name)}
                  size="sm"
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
