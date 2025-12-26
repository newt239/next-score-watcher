import type { Metadata } from "next";
import { cookies } from "next/headers";

import ButtonLink from "@/components/ButtonLink";
import { Flex } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
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
      <ManagePlayer currentProfile={currentProfile} from={from} />
    </Flex>
  );
};

export default PlayerPage;
