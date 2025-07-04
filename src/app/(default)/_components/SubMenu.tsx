"use client";

import { usePathname } from "next/navigation";

import { Flex } from "@mantine/core";
import {
  IconExternalLink,
  IconHelp,
  IconHome,
  IconInfoCircle,
  IconList,
  IconListDetails,
  IconQuestionMark,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import type { AuthUser } from "@supabase/supabase-js";

import ButtonLink from "@/app/_components/ButtonLink";

const linkList: { text: string; path: string; icon: React.ReactNode }[] = [
  { path: "/", text: "ホーム", icon: <IconHome /> },
  { path: "/rules", text: "形式一覧", icon: <IconListDetails /> },
  { path: "/games", text: "作成したゲーム", icon: <IconList /> },
  { path: "/players", text: "プレイヤー管理", icon: <IconUsers /> },
  { path: "/quizes", text: "問題管理", icon: <IconQuestionMark /> },
  { path: "/option", text: "アプリ設定", icon: <IconSettings /> },
  { path: "/docs", text: "アプリ情報", icon: <IconInfoCircle /> },
  {
    path: "https://docs.score-watcher.com/",
    text: "使い方を見る",
    icon: <IconHelp />,
  },
];

type SubMenuProps = {
  user: AuthUser | null;
};

const SubMenu: React.FC<SubMenuProps> = ({ user }) => {
  const pathname = usePathname();

  return (
    <Flex direction="column">
      {linkList.map((link) => (
        <ButtonLink
          justify="flex-start"
          fullWidth
          size="md"
          aria-current={link.path === pathname}
          href={link.path}
          key={link.path}
          variant={link.path === pathname ? "white" : "filled"}
          leftSection={link.icon}
        >
          {link.text}
          {link.path.startsWith("http") && <IconExternalLink />}
        </ButtonLink>
      ))}
      {user && (
        <ButtonLink
          justify="flex-start"
          fullWidth
          size="md"
          aria-current={"/account" === pathname}
          href="/account"
          key="/account"
          variant={"/account" === pathname ? "white" : "filled"}
          leftSection={<IconSettings />}
        >
          アカウント設定
        </ButtonLink>
      )}
    </Flex>
  );
};

export default SubMenu;
