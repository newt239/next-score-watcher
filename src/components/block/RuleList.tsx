import { useNavigate } from "react-router-dom";

import { Box, Button, Card, SimpleGrid } from "@chakra-ui/react";
import { CirclePlus } from "tabler-icons-react";

import { createGame } from "~/utils/functions";
import { rules } from "~/utils/rules";
import { RuleNames } from "~/utils/types";

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
        pt={3}
        spacing={3}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].description;
          return (
            <Card
              gap={3}
              justifyContent="space-between"
              key={rule_name}
              p={3}
              variant="filled"
            >
              <Box>
                <h3 style={{ whiteSpace: "nowrap" }}>
                  {rules[rule_name].name}
                </h3>
                <Box
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {description}
                </Box>
              </Box>
              <Box textAlign="end">
                <Button
                  colorScheme="green"
                  leftIcon={<CirclePlus />}
                  onClick={() => onClick(rule_name)}
                  size="sm"
                >
                  作る
                </Button>
              </Box>
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default RuleList;
