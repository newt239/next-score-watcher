"use client";

import { Box, Button, Card, Flex, List } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { cdate } from "cdate";

import ClientLink from "@/components/ClientLink/ClientLink";
import Link from "@/components/Link";

import classes from "./GameListGrid.module.css";

import type { ParsedGameListItem } from "@/utils/types";

type Props = {
  gameList: ParsedGameListItem[];
};

const GameListGrid: React.FC<Props> = ({ gameList }) => {
  return (
    <>
      {gameList.length === 0 ? (
        <p>
          作成済みのゲームはありません。
          <Link href="/rules">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : (
        <Box className={classes.game_list_grid}>
          {gameList.map((game) => (
            <Card
              className={classes.game_card}
              component={ClientLink}
              href={`/games/${game.id}/config`}
              key={game.id}
              shadow="xs"
              title={game.name}
              withBorder
            >
              <Card.Section className={classes.game_name} withBorder inheritPadding>
                {game.name}
              </Card.Section>
              <Card.Section className={classes.game_description}>
                <List>
                  <List.Item>
                    {game.type} ／ {game.player_count}人
                  </List.Item>
                  <List.Item>進行状況: {game.state}</List.Item>
                </List>
              </Card.Section>
              <Flex className={classes.game_footer}>
                <Box>{cdate(game.last_open).format("MM/DD HH:mm")}</Box>
                <Button component="span" rightSection={<IconChevronRight />} size="sm">
                  開く
                </Button>
              </Flex>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default GameListGrid;
