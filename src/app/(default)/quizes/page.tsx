import type { Metadata } from "next";

import { Flex } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import ButtonLink from "@/components/ButtonLink";
import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import ManageQuiz from "./_components/ManageQuiz/ManageQuiz";

export const metadata: Metadata = {
  title: "問題管理",
  alternates: {
    canonical: "https://score-watcher.com/quizes",
  },
};

type Props = {
  searchParams: Promise<{
    from?: string;
  }>;
};

const QuizesPage = async ({ searchParams }: Props) => {
  const { from } = await searchParams;

  return (
    <Flex direction="column" gap="xs">
      {from && (
        <ButtonLink
          href={`/games/${from}/config`}
          leftSection={<IconArrowLeft />}
          variant="white"
          style={{ width: "fit-content" }}
        >
          ゲーム設定に戻る
        </ButtonLink>
      )}
      <ManageQuiz currentProfile={DEFAULT_CURRENT_PROFILE} />
    </Flex>
  );
};

export default QuizesPage;
