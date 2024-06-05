"use client";

import { Button, Flex } from "@mantine/core";
import Link from "next/link";
import { ExternalLink } from "tabler-icons-react";

const linkList: { text: string; path: string }[] = [
  { path: "/", text: "ホーム" },
  { path: "/rules", text: "形式一覧" },
  { path: "/games", text: "作成したゲーム" },
  { path: "/players", text: "プレイヤー管理" },
  { path: "/quizes", text: "問題管理" },
  { path: "/option", text: "アプリ設定" },
  { path: "https://docs.score-watcher.com/", text: "使い方を見る" },
];

const SubMenu: React.FC = () => {
  return (
    <Flex className="flex-col">
      {linkList.map((link) => (
        <Button
          component={Link}
          aria-current={link.path === location.pathname}
          href={link.path}
          key={link.path}
          variant={link.path === location.pathname ? "filled" : "subtle"}
        >
          {link.text}
          {link.path.startsWith("http") && <ExternalLink className="ml-2" />}
        </Button>
      ))}
    </Flex>
  );
};

export default SubMenu;
