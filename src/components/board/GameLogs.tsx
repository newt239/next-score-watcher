import { useState } from "react";

import {
  Box,
  Stack,
  TableContainer,
  Table,
  Tbody,
  Td,
  theme,
  Tr,
  useColorMode,
  useMediaQuery,
  Button,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { History, SortAscending, SortDescending } from "tabler-icons-react";

import H3 from "#/blocks/H3";
import { LogDBProps } from "#/utils/db";

type GameLogsProps = {
  players: { id: string; name: string }[];
  logs: LogDBProps[];
};

const GameLogs: React.FC<GameLogsProps> = ({ players, logs }) => {
  const { colorMode } = useColorMode();
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");
  const [reverse, setReverse] = useState<Boolean>(true);

  return (
    <Box
      sx={{
        p: 3,
        my: 10,
        maxW: "100vw",
      }}
    >
      <H3 display="flex" gap={3} p={3}>
        <History />
        試合ログ
      </H3>
      <Box
        sx={{
          borderStyle: "solid",
          borderWidth: isLargerThan700 ? 3 : 1,
          borderColor:
            colorMode === "light"
              ? theme.colors.gray[50]
              : theme.colors.gray[700],
          p: 3,
          borderRadius: isLargerThan700 ? "1rem" : "0.5rem",
        }}
      >
        <Box sx={{ pb: 2 }}>
          <Button
            size="sm"
            leftIcon={reverse ? <SortAscending /> : <SortDescending />}
            onClick={() => setReverse((v) => !v)}
          >
            {reverse ? "降順" : "昇順"}
          </Button>
        </Box>
        {logs.length !== 0 ? (
          <>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Tbody>
                  {
                    // https://qiita.com/seltzer/items/2f9ee13cf085966f1a4c
                    (reverse ? logs.slice().reverse() : logs).map((log, qn) => {
                      const player = players.find(
                        (p) => p.id === log.player_id
                      );
                      return (
                        <Tr key={log.id}>
                          <Td>{reverse ? logs.length - qn : qn + 1}.</Td>
                          <Td>{player ? player.name : "-"}</Td>
                          <Td>
                            {log.variant === "correct"
                              ? "o"
                              : log.variant === "wrong"
                              ? "x"
                              : "-"}
                          </Td>
                          <Td
                            title={cdate(log.timestamp).format(
                              "YYYY年MM月DD日 HH時mm分ss秒"
                            )}
                          >
                            {cdate(log.timestamp).format("HH:mm:ss")}
                          </Td>
                        </Tr>
                      );
                    })
                  }
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <p>ここに解答者の一覧が表示されます。</p>
        )}
      </Box>
    </Box>
  );
};

export default GameLogs;
