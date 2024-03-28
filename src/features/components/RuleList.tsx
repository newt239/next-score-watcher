import { useNavigate } from "react-router-dom";

import { CirclePlus } from "tabler-icons-react";

import Button from "#/components/Button";
import Card from "#/components/Card";
import { createGame } from "#/utils/functions";
import { rules } from "#/utils/rules";
import { RuleNames } from "#/utils/types";
import { css } from "@panda/css";

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
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          pt: "24px",
        })}
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].description;
          return (
            <Card
              action={
                <Button
                  onClick={() => onClick(rule_name)}
                  rightIcon={<CirclePlus />}
                >
                  作る
                </Button>
              }
              key={rule_name}
              title={rules[rule_name].name}
            >
              <div
                className={css({
                  "-webkit-box-orient": "vertical",
                  WebkitLineClamp: 3,
                  display: "-webkit-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                } as any)}
              >
                {description}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RuleList;
