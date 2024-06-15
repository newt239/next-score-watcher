"use client";

import { usePathname } from "next/navigation";

import { Flex } from "@mantine/core";
import {
  ExternalLink,
  Help,
  Home,
  List,
  ListDetails,
  QuestionMark,
  Settings,
  Users,
} from "tabler-icons-react";

import ButtonLink from "@/app/_components/ButtonLink";

const linkList: { text: string; path: string; icon: React.ReactNode }[] = [
  { path: "/", text: "ホーム", icon: <Home /> },
  { path: "/rules", text: "形式一覧", icon: <ListDetails /> },
  { path: "/games", text: "作成したゲーム", icon: <List /> },
  { path: "/players", text: "プレイヤー管理", icon: <Users /> },
  { path: "/quizes", text: "問題管理", icon: <QuestionMark /> },
  { path: "/option", text: "アプリ設定", icon: <Settings /> },
  {
    path: "https://docs.score-watcher.com/",
    text: "使い方を見る",
    icon: <Help />,
  },
];

const SubMenu: React.FC = () => {
  const pathname = usePathname();

  return (
    <Flex className="flex-col">
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
          {link.path.startsWith("http") && <ExternalLink className="ml-2" />}
        </ButtonLink>
      ))}
    </Flex>
  );
};

export default SubMenu;
