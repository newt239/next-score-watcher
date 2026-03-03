import type { Metadata } from "next";

import { Flex } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import ButtonLink from "@/components/ButtonLink";
import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import ManagePlayer from "./_components/ManagePlayer/ManagePlayer";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    from?: string;
  }>;
};

export const metadata: Metadata = {
  title: "プレイヤー管理",
  alternates: {
    canonical: "https://score-watcher.com/players",
  },
};

const PlayerPage = async ({ searchParams }: Props) => {
  const { from } = await searchParams;

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
      <ManagePlayer currentProfile={DEFAULT_CURRENT_PROFILE} from={from} />
    </Flex>
  );
};

export default PlayerPage;
