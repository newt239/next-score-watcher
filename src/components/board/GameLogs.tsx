import {
  Box,
  Stack,
  theme,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { History } from "tabler-icons-react";

import H3 from "#/blocks/H3";
import { LogDBProps, PlayerDBProps } from "#/utils/db";

type GameLogsProps = {
  players: PlayerDBProps[];
  logs: LogDBProps[];
};

const GameLogs: React.FC<GameLogsProps> = ({ players, logs }) => {
  const { colorMode } = useColorMode();
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  return (
    <Box p={1}>
      <H3 sx={{ display: "flex", gap: 3, p: 3 }}>
        <History />
        ログ
      </H3>
      <Stack
        sx={{
          borderStyle: "solid",
          borderWidth: isLargerThan700 ? 3 : 1,
          borderColor:
            colorMode === "light"
              ? theme.colors.gray[50]
              : theme.colors.gray[700],
          p: 3,
          borderRadius: isLargerThan700 ? "1rem" : "0.5rem",
          whiteSpace: "nowrap",
          overflowX: "hidden",
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
                return <div>Q{logs.length - i}: 問題がスルーされました。</div>;
              return (
                <div
                  key={log.id}
                  title={cdate(log.timestamp).format(
                    "YYYY年MM月DD日 HH時mm分ss秒"
                  )}
                >
                  Q{logs.length - i}: {player.name} が
                  {log.variant === "correct" ? "正解" : "誤答"}
                  しました。
                  {isLargerThan700 && (
                    <span
                      style={{
                        color:
                          colorMode === "light"
                            ? theme.colors.gray[50]
                            : theme.colors.gray[700],
                      }}
                    >
                      {cdate(log.timestamp).format("HH:mm:ss")}
                    </span>
                  )}
                </div>
              );
            })
        ) : (
          <p>ここに試合のログが表示されます。</p>
        )}
      </Stack>
    </Box>
  );
};

export default GameLogs;
