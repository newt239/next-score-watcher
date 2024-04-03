import { useNavigate } from "react-router-dom";

import { Button } from "@chakra-ui/react";
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
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          pt: "12px",
        })}
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].short_description;
          return (
            <div
              className={css({
                display: "grid",
                gridTemplateRows: "subgrid",
                gridRow: "span 4",
                backgroundColor: "gray.200",
                borderRadius: "8px",
                p: "12px",
                _dark: {
                  backgroundColor: "gray.700",
                },
              })}
              key={rule_name}
            >
              <h3 style={{ whiteSpace: "nowrap" }}>{rules[rule_name].name}</h3>
              <div>{description}</div>
              <div
                className={css({
                  display: "flex",
                  justifyContent: "flex-end",
                })}
              >
                <Button
                  colorScheme="green"
                  onClick={() => onClick(rule_name)}
                  size="sm"
                  leftIcon={<CirclePlus />}
                  className={css({
                    cursor: "pointer",
                  })}
                >
                  作る
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RuleList;
