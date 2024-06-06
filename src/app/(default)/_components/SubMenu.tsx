"use client";

import { usePathname } from "next/navigation";

import { Flex } from "@mantine/core";
import { ExternalLink } from "tabler-icons-react";

import ButtonLink from "@/app/_components/ButtonLink";

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
  const pathname = usePathname();

  return (
    <Flex className="flex-col">
      {linkList.map((link) => (
        <ButtonLink
          aria-current={link.path === pathname}
          href={link.path}
          key={link.path}
          variant={link.path === pathname ? "filled" : "subtle"}
        >
          {link.text}
          {link.path.startsWith("http") && <ExternalLink className="ml-2" />}
        </ButtonLink>
      ))}
    </Flex>
  );
};

export default SubMenu;
