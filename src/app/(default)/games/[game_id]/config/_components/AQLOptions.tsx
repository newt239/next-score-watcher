"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

import db from "@/utils/db";
import { AllGameProps } from "@/utils/types";

type Props = {
  game: AllGameProps["aql"];
  disabled?: boolean;
  currentProfile: string;
};

const AQLOptions: React.FC<Props> = ({ game, disabled, currentProfile }) => {
  const { game_id } = useParams();
  const [leftTeamName, setLeftTeamName] = useState<string>("");
  const [rightTeamName, setRightTeamName] = useState<string>("");
  const debouncedLeftTeamName = useDebouncedValue(leftTeamName, 500);
  const debouncedRightTeamName = useDebouncedValue(rightTeamName, 500);

  useEffect(() => {
    if (game) {
      setLeftTeamName(game.options.left_team);
      setRightTeamName(game.options.right_team);
    }
  }, [game]);

  useEffect(() => {
    db(currentProfile).games.update(game_id as string, {
      options: {
        left_team: leftTeamName,
        right_team: rightTeamName,
      },
    });
  }, [debouncedLeftTeamName, debouncedRightTeamName]);

  if (!game) return null;

  return (
    <>
      <TextInput
        disabled={disabled}
        label="左チーム名"
        onChange={(v) => setLeftTeamName(v.target.value)}
        placeholder="Team A"
        value={leftTeamName}
        width="auto"
        size="md"
      />
      <TextInput
        disabled={disabled}
        label="右チーム名"
        onChange={(v) => setRightTeamName(v.target.value)}
        placeholder="Team B"
        value={rightTeamName}
        width="auto"
        size="md"
      />
    </>
  );
};

export default AQLOptions;
