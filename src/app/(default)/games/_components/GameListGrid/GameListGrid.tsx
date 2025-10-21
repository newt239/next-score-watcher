"use client";

import { Box, Card, Flex, List } from "@mantine/core";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { cdate } from "cdate";

import classes from "./GameListGrid.module.css";

import ButtonLink from "@/components/ButtonLink";
import Link from "@/components/Link";

type Props = {
  gameList: {
    id: string;
    name: string;
    type: string;
    player_count: number;
    state: string;
    last_open: string;
  }[];
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
            <Card shadow="xs" key={game.id} title={game.name} withBorder>
              <Card.Section
                className={classes.game_name}
                withBorder
                inheritPadding
              >
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
                <ButtonLink
                  href={`/games/${game.id}/config`}
                  leftSection={<IconAdjustmentsHorizontal />}
                  size="sm"
                >
                  開く
                </ButtonLink>
              </Flex>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default GameListGrid;
