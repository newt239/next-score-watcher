import { Box, Container, Stack, useColorMode } from "@chakra-ui/react";
import { History } from "tabler-icons-react";

import H3 from "#/blocks/H3";
import { LogDBProps, PlayerDBProps } from "#/utils/db";

interface GameLogsProps {
  players: PlayerDBProps[];
  logs: LogDBProps[];
}

const GameLogs: React.FC<GameLogsProps> = ({ players, logs }) => {
  const { colorMode } = useColorMode();
  return (
    <Container mt="10vh">
      <H3 sx={{ display: "flex", gap: 3, p: 3 }}>
        <History />
        ログ
      </H3>
      <Stack
        sx={{
          borderStyle: "solid",
          borderWidth: 3,
          borderColor:
            colorMode === "light"
              ? "rgb(231, 235, 240)"
              : "rgba(194, 224, 255, 0.08)",
          p: 3,
          mb: 10,
          borderRadius: "1rem",
        }}
      >
        {logs.length !== 0 ? (
          logs
            .slice()
            .reverse()
            .map((log, i) => {
              const player = players.find((p) => p.id === log.player_id);
              if (!player) return null;
              if (log.variant === "through")
                return <Box>Q{logs.length - i}: 問題がスルーされました。</Box>;
              return (
                <Box key={log.id}>
                  Q{logs.length - i}: {player.name} が{" "}
                  {log.variant === "correct" ? "正解" : "誤答"}
                  しました。
                </Box>
              );
            })
        ) : (
          <p>ここに試合のログが表示されます。</p>
        )}
      </Stack>
    </Container>
  );
};

export default GameLogs;
