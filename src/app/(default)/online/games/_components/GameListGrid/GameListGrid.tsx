import { Box, Card, CardSection, Group, Text } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconPlayerPlay } from "@tabler/icons-react";
import Avatar from "boring-avatars";
import { cdate } from "cdate";

import PublicityBadge from "../PublicityBadge/PublicityBadge";

import classes from "./GameListGrid.module.css";

import ButtonLink from "@/components/ButtonLink";
import Link from "@/components/Link";

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
            <Card shadow="xs" key={game.id} title={game.name} withBorder data-testid="game-card">
              <CardSection className={classes.game_avatar}>
                <Avatar
                  name={game.id}
                  square
                  colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                />
              </CardSection>
              <Group justify="space-between" align="center" my="xs">
                <Text fw="bold" size="lg">
                  {game.name}
                </Text>
                <PublicityBadge isPublic={game.isPublic} size="xs" />
              </Group>
              <CardSection className={classes.game_description}>
                <Text size="sm">
                  {game.logCount}問目 ・ {game.playerCount}人 ・{" "}
                  {cdate(game.updatedAt).format("MM/DD")}
                </Text>
              </CardSection>
              <Group className={classes.game_footer}>
                <ButtonLink
                  href={`/online/games/${game.id}/config`}
                  leftSection={<IconAdjustmentsHorizontal />}
                  size="sm"
                  flex={1}
                  variant="outline"
                >
                  設定
                </ButtonLink>
                <ButtonLink
                  href={`/online/games/${game.id}/board`}
                  leftSection={<IconPlayerPlay />}
                  size="sm"
                  flex={1}
                  disabled={game.playerCount === 0}
                >
                  表示
                </ButtonLink>
              </Group>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default GameListGrid;
