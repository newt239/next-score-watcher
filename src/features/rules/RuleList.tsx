import { useNavigate } from "react-router-dom";

import { Button, Card } from "@chakra-ui/react";
import { CirclePlus } from "tabler-icons-react";

import { css } from "@panda/css";
import { createGame } from "~/utils/functions";
import { rules } from "~/utils/rules";
import { RuleNames } from "~/utils/types";

const RuleList: React.FC = () => {
  const navigate = useNavigate();
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name);
    navigate(`/games/${game_id}/config`);
  };

  return (
    <div>
      <h2>形式一覧</h2>
      <div
        className={css({
          display: "grid",
          gap: "12px",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          pt: "12px",
        })}
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].description;
          return (
            <Card
              className={css({
                display: "grid",
                justifyContent: "space-between",
                gap: "12px",
                p: "12px",
              })}
              key={rule_name}
              variant="filled"
            >
              <h3 style={{ whiteSpace: "nowrap" }}>{rules[rule_name].name}</h3>
              <div
                className={css({
                  height: "80px",
                  overflow: "hidden",
                })}
              >
                {description}
              </div>
              <div>
                <Button
                  colorScheme="green"
                  onClick={() => onClick(rule_name)}
                  size="sm"
                >
                  作る
                  <CirclePlus />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RuleList;
