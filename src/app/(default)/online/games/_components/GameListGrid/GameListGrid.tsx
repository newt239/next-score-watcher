"use client";

import { Box, Card, Flex, List } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconPlayerPlay } from "@tabler/icons-react";
import { cdate } from "cdate";

import PublicityBadge from "../PublicityBadge/PublicityBadge";
import ShareGameButton from "../ShareGameButton/ShareGameButton";

import classes from "./GameListGrid.module.css";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";

type GameListGridProps = {
  gameList: {
    id: string;
    name: string;
    ruleType: string;
    playerCount: number;
    logCount: number;
    updatedAt: string;
    isPublic: boolean;
  }[];
};

const GameListGrid: React.FC<GameListGridProps> = ({ gameList }) => {
  return (
    <>
      {gameList.length === 0 ? (
        <p>
          作成済みのクラウドゲームはありません。
          <Link href="/rules">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : (
        <Box className={classes.game_list_grid}>
          {gameList.map((game) => (
            <Card
              shadow="xs"
              key={game.id}
              title={game.name}
              withBorder
              data-testid="game-card"
            >
              <Card.Section
                className={classes.game_name}
                withBorder
                inheritPadding
              >
                {game.name}
              </Card.Section>
              <Card.Section className={classes.game_description}>
                <Flex justify="space-between" align="center" mb="xs">
                  <div>
                    {game.ruleType} ／ {game.playerCount}人
                  </div>
                  <PublicityBadge isPublic={game.isPublic} size="xs" />
                </Flex>
                <List>
                  <List.Item>進行状況: {game.logCount}問目</List.Item>
                </List>
              </Card.Section>
              <Flex className={classes.game_footer}>
                <Box>{cdate(game.updatedAt).format("MM/DD HH:mm")}</Box>
                <Flex gap="xs">
                  <ShareGameButton
                    gameId={game.id}
                    isPublic={game.isPublic}
                    size="sm"
                  />
                  <ButtonLink
                    href={`/online/games/${game.id}/board`}
                    leftSection={<IconPlayerPlay />}
                    size="sm"
                    variant="filled"
                  >
                    ボード表示
                  </ButtonLink>
                  <ButtonLink
                    href={`/online/games/${game.id}/config`}
                    leftSection={<IconAdjustmentsHorizontal />}
                    size="sm"
                  >
                    設定
                  </ButtonLink>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default GameListGrid;
