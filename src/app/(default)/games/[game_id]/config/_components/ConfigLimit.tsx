"use client";

import { useTransition } from "react";

import { Loader } from "tabler-icons-react";

import ConfigNumberInput from "./ConfigNumberInput";

import Switch from "#/app/_components/Switch";
import { onGameLimitToggle } from "#/utils/actions";
import { RuleNames } from "#/utils/types";
import { css } from "@panda/css";

type ConfigLimitProps = {
  rule: RuleNames;
  game_id: string;
  limit: number | null;
  win_through: number | null;
};

const ConfigLimit: React.FC<ConfigLimitProps> = ({
  rule,
  game_id,
  limit,
  win_through,
}) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        pt: "16px",
      })}
    >
      <div
        className={css({
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        })}
      >
        <Switch
          defaultChecked={!!limit}
          onChange={(e) =>
            startTransition(() =>
              onGameLimitToggle({
                checked: e.target.checked,
                game_id,
                rule,
              })
            )
          }
        >
          限定問題数を設定する
        </Switch>
        {isPending && <Loader />}
      </div>
      <div
        className={css({
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        })}
      >
        <ConfigNumberInput
          defaultValue={limit || 0}
          disabled={!limit}
          game_id={game_id}
          input_id="limit"
          label="限定問題数"
          max={100}
          min={0}
        />
        <ConfigNumberInput
          defaultValue={win_through || 0}
          disabled={!win_through}
          game_id={game_id}
          input_id="win_through"
          label="勝ち抜け人数"
          max={100}
          min={0}
        />
      </div>
    </div>
  );
};

export default ConfigLimit;
