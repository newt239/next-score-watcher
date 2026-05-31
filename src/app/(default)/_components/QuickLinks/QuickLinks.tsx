import { Box, Button, Card, Text, Title } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

import ClientLink from "@/components/ClientLink/ClientLink";

import classes from "./QuickLinks.module.css";

type QuickLink = {
  href: string;
  title: string;
  description: string;
};

/** プレイヤー管理・問題管理ページへ誘導するカード群 */
const QuickLinks = () => {
  const links: QuickLink[] = [
    {
      href: "/players",
      title: "プレイヤー管理",
      description: "ゲームで使用するプレイヤーを登録・編集できます。",
    },
    {
      href: "/quizes",
      title: "問題管理",
      description: "問題文を読み込んで得点表示画面に表示できます。",
    },
  ];

  return (
    <Box className={classes.quick_links}>
      {links.map((link) => (
        <Card
          className={classes.quick_link_card}
          component={ClientLink}
          href={link.href}
          key={link.href}
          shadow="xs"
          withBorder
        >
          <Title className={classes.quick_link_title} order={3}>
            {link.title}
          </Title>
          <Text className={classes.quick_link_description}>{link.description}</Text>
          <Box className={classes.quick_link_footer}>
            <Button component="span" rightSection={<IconChevronRight />} size="sm">
              開く
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default QuickLinks;
