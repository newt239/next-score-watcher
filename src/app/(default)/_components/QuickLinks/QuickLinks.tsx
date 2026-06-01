import { Box, Card, Group, Title } from "@mantine/core";
import {
  IconChevronRight,
  IconExternalLink,
  IconFileText,
  IconHelp,
  IconHistory,
  IconInfoCircle,
  IconList,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";

import classes from "./QuickLinks.module.css";

type QuickLink = {
  href: string;
  title: string;
  icon: React.ReactNode;
  external?: boolean;
};

/** サイドバーの各ページへ誘導するカード群 */
const QuickLinks = () => {
  const links: QuickLink[] = [
    { href: "/rules", title: "形式一覧", icon: <IconListDetails /> },
    { href: "/games", title: "作成したゲーム", icon: <IconList /> },
    { href: "/players", title: "プレイヤー管理", icon: <IconUsers /> },
    { href: "/quizes", title: "問題管理", icon: <IconFileText /> },
    { href: "/option", title: "アプリ設定", icon: <IconSettings /> },
    { href: "/docs", title: "アプリ情報", icon: <IconInfoCircle /> },
    { href: "/changelog", title: "アップデート履歴", icon: <IconHistory /> },
    {
      href: "https://docs.score-watcher.com/",
      title: "使い方を見る",
      icon: <IconHelp />,
      external: true,
    },
  ];

  return (
    <Box className={classes.quick_links}>
      <Title order={2} style={{ padding: 0 }}>
        メニュー
      </Title>
      <Box className={classes.card_grid}>
        {links.map((link) => (
          <Link
            className={classes.quick_link_card_link}
            href={link.href}
            key={link.href}
            rel={link.external ? "noopener noreferrer" : undefined}
            target={link.external ? "_blank" : undefined}
          >
            <Card className={classes.quick_link_card} shadow="xs" withBorder>
              <Group className={classes.quick_link_label} gap="sm" wrap="nowrap">
                {link.icon}
                <Title className={classes.quick_link_title} order={3}>
                  {link.title}
                </Title>
              </Group>
              {link.external ? (
                <IconExternalLink className={classes.quick_link_chevron} />
              ) : (
                <IconChevronRight className={classes.quick_link_chevron} />
              )}
            </Card>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default QuickLinks;
