"use client";

import { Flex } from "@radix-ui/themes";

import ButtonLink from "#/components/ButtonLink";
import { css } from "@panda/css";

const linkList: { text: string; path: string }[] = [
  { text: "ホーム", path: "/" },
  { text: "プレイヤー管理", path: "/player/" },
  { text: "問題管理", path: "/quiz/" },
  { text: "アプリ設定", path: "/option/" },
];

const SubMenu: React.FC = () => {
  return (
    <Flex
      className={css({
        display: "flex",
        flexDirection: "column",
      })}
    >
      {linkList.map((link) => (
        <ButtonLink
          aria-current={link.path === window.location.pathname}
          href={link.path}
          key={link.path}
          sx={{
            w: "100%",
            _currentPage: {
              bgColor: "emerald.500",
            },
          }}
          variant={link.path === window.location.pathname ? "solid" : "ghost"}
        >
          {link.text}
        </ButtonLink>
      ))}
    </Flex>
  );
};

export default SubMenu;
