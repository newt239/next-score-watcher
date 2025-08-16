import { Flex, Text } from "@mantine/core";

import styles from "../ViewerBoard/ViewerBoard.module.css";

import type { ComputedScoreProps } from "@/models/games";

// AQL専用ボード（観戦専用）
const ViewerAQLBoard = ({ players }: { players: ComputedScoreProps[] }) => {
  return (
    <div className={styles.aqlContainer}>
      <div className={styles.aqlPlayers}>
        {players.map((player) => (
          <div key={player.player_id} className={styles.aqlPlayer}>
            <Text size="md" fw={600} c="white" ta="center">
              {player.text || `プレイヤー${player.player_id}`}
            </Text>
            <Text size="xl" fw={700} c="yellow" ta="center">
              {player.score}
            </Text>
            <Flex gap="sm" justify="center">
              <Text size="sm" c="green">
                {player.correct}
              </Text>
              <Text size="sm" c="red">
                {player.wrong}
              </Text>
            </Flex>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewerAQLBoard;
