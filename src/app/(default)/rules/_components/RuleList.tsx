"use client";

import { useRouter } from "next/navigation";

import { CirclePlus } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import Card from "#/app/_components/Card";
import { createGame } from "#/utils/functions";
import { rules } from "#/utils/rules";
import { RuleNames } from "#/utils/types";
import { css } from "@panda/css";

const RuleList: React.FC = () => {
  const router = useRouter();
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name);
    router.push(`/games/${game_id}/config`);
  };

  return (
    <div>
      <h2>形式一覧</h2>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
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
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  "-webkit-box-orient": "vertical",
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
