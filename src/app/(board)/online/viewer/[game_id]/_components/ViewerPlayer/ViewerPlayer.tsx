import { Text } from "@mantine/core";

import styles from "./ViewerPlayer.module.css";

import type { ComputedScoreProps } from "@/models/games";

// 個別プレイヤーカード（観戦専用）
type ViewerPlayerProps = {
  player: ComputedScoreProps;
};

const ViewerPlayer = ({ player }: ViewerPlayerProps) => {
  // プレイヤー名を取得（player.textを使用）
  const playerName = player.text || `プレイヤー${player.player_id}`;
  return (
    <div className={styles["player-card"]}>
      <div className={styles["player-info"]}>
        <Text size="lg" fw={600} c="white">
          {playerName}
        </Text>
        <Text size="sm" c="dimmed">
          {player.order}位
        </Text>
      </div>
      <div className={styles["player-score"]}>
        <Text size="xl" fw={700} c="yellow">
          {player.score}pt
        </Text>
        <div className={styles["player-stats"]}>
          <Text size="sm" c="green">
            正解: {player.correct}
          </Text>
          <Text size="sm" c="red">
            誤答: {player.wrong}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ViewerPlayer;
