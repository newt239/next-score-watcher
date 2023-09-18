"use client";

import { useRouter } from "next/navigation";

import { CirclePlus } from "tabler-icons-react";

import Button from "#/components/Button";
import { createGame } from "#/utils/functions";
import { rules } from "#/utils/rules";
import { RuleNames } from "#/utils/types";
import { css } from "@panda/css";

const RuleList: React.FC = () => {
  const router = useRouter();
  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = async (rule_name: RuleNames) => {
    const game_id = await createGame(rule_name);
    router.push(`/${game_id}/config`);
  };

  return (
    <div>
      <h2>形式一覧</h2>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "32px",
          pt: "24px",
        })}
      >
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].description;
          return (
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
                p: "8px",
                borderRadius: "lg",
                bg: "gray.100",
              })}
              key={rule_name}
            >
              <div>
                <h3 style={{ whiteSpace: "nowrap", paddingTop: "0px" }}>
                  {rules[rule_name].name}
                </h3>
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
              </div>
              <div className={css({ textAlign: "right" })}>
                <Button onClick={() => onClick(rule_name)}>
                  作る
                  <CirclePlus />
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
