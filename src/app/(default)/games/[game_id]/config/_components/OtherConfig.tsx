"use client";

import { Box, Title } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import ConfigInput from "./ConfigInput";
import CopyGame from "./CopyGame";
import DeleteGame from "./DeleteGame";
import ExportGame from "./ExportGame";
import SelectQuizset from "./SelectQuizset";

import db from "@/utils/db";
import { GamePropsUnion } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  currentProfile: string;
};

const OtherConfig: React.FC<Props> = ({ game, currentProfile }) => {
  const quizes = useLiveQuery(() => db(currentProfile).quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));

  return (
    <Box>
      <SelectQuizset
        game_id={game.id}
        game_quiz={game.quiz}
        quizset_names={quizsetList}
        currentProfile={currentProfile}
      />
      <Title order={3} mt="xl">
        オプション
      </Title>
      <ConfigInput
        label="Discord Webhook"
        input_id="discord_webhook_url"
        placeholder="https://discord.com/api/webhooks/..."
        currentProfile={currentProfile}
        type="url"
      />
      <Title order={3} mt="xl">
        ゲーム
      </Title>
      <CopyGame game={game} currentProfile={currentProfile} />
      <ExportGame game={game} currentProfile={currentProfile} />
      <DeleteGame game={game} currentProfile={currentProfile} />
    </Box>
  );
};

export default OtherConfig;
