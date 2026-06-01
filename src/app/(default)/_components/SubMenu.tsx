"use client";

import { Flex } from "@mantine/core";
import {
  IconHelp,
  IconHistory,
  IconHome,
  IconInfoCircle,
  IconList,
  IconListDetails,
  IconQuestionMark,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import ButtonLink from "@/components/ButtonLink";

/**
 * サイドメニューのリンクリスト
 */
const linkList: { text: string; path: string; icon: React.ReactNode }[] = [
  { path: "/", text: "ホーム", icon: <IconHome /> },
  { path: "/rules", text: "形式一覧", icon: <IconListDetails /> },
  { path: "/games", text: "作成したゲーム", icon: <IconList /> },
  { path: "/players", text: "プレイヤー管理", icon: <IconUsers /> },
  { path: "/quizes", text: "問題管理", icon: <IconQuestionMark /> },
  { path: "/option", text: "アプリ設定", icon: <IconSettings /> },
  { path: "/docs", text: "アプリ情報", icon: <IconInfoCircle /> },
  { path: "/changelog", text: "アップデート履歴", icon: <IconHistory /> },
  {
    path: "https://docs.score-watcher.com/",
    text: "使い方を見る",
    icon: <IconHelp />,
  },
];

const SubMenu: React.FC = () => {
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
        </ButtonLink>
      ))}
    </Flex>
  );
};

export default SubMenu;
