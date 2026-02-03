import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Flex } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import ButtonLink from "@/components/ButtonLink";

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
  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return (
    <Flex direction="column" gap="xs">
      {from && (
        <ButtonLink
          href={`/games/${from}/config`}
          leftSection={<IconArrowLeft />}
          variant="subtle"
          style={{ width: "fit-content" }}
        >
          ゲーム設定に戻る
        </ButtonLink>
      )}
      <ManageQuiz currentProfile={currentProfile} />
    </Flex>
  );
};

export default QuizesPage;
