"use client";

import { usePathname, useRouter } from "next/navigation";

import { Box, Tabs } from "@mantine/core";

import classes from "./ConfigTabs.module.css";

type ConfigTabsProps = {
  gameId: string;
  children: React.ReactNode;
};

/**
 * 設定ページのタブナビゲーション
 * アクセシビリティを維持しつつLinkコンポーネントで実装
 */
const ConfigTabs = ({ gameId, children }: ConfigTabsProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabs
      pt="lg"
      variant="outline"
      className={classes.tabs_area}
      value={pathname.split("/").at(-1)}
      onChange={(value) =>
        router.push(`/online/games/${gameId}/config/${value}`)
      }
    >
      <Tabs.List className={classes.tab_list} grow>
        <Tabs.Tab
          value="rule"
          py="md"
          role="tab"
          aria-current={
            pathname.split("/").at(-1) === "rule" ? "page" : undefined
          }
          tabIndex={0}
        >
          形式設定
        </Tabs.Tab>
        <Tabs.Tab
          value="player"
          py="md"
          role="tab"
          aria-current={
            pathname.split("/").at(-1) === "player" ? "page" : undefined
          }
          tabIndex={0}
        >
          プレイヤー設定
        </Tabs.Tab>
        <Tabs.Tab
          value="other"
          py="md"
          role="tab"
          aria-current={
            pathname.split("/").at(-1) === "other" ? "page" : undefined
          }
          tabIndex={0}
        >
          その他の設定
        </Tabs.Tab>
      </Tabs.List>
      <Box className={classes.tab_panel_area}>{children}</Box>
    </Tabs>
  );
};

export default ConfigTabs;
