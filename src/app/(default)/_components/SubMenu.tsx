"use client";

import { usePathname } from "next/navigation";

import { Flex } from "@radix-ui/themes";

import ButtonLink from "#/app/_components/ButtonLink";
import { css } from "@panda/css";

const linkList: { text: string; path: string }[] = [
  { text: "ホーム", path: "/" },
  { text: "プレイヤー管理", path: "/players" },
  { text: "問題管理", path: "/quizes" },
  { text: "アプリ設定", path: "/config" },
];

const SubMenu: React.FC = () => {
  const pathname = usePathname();

  return (
    <Flex
      className={css({
        display: "flex",
        flexDirection: "column",
      })}
    >
      {linkList.map((link) => (
        <ButtonLink
          aria-current={link.path === pathname}
          href={link.path}
          key={link.path}
          sx={{
            w: "100%",
            _currentPage: {
              bgColor: "emerald.500",
            },
          }}
          variant={link.path === pathname ? "solid" : "ghost"}
        >
          {link.text}
        </ButtonLink>
      ))}
    </Flex>
  );
};

export default SubMenu;
