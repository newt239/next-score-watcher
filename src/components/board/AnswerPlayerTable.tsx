import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  theme,
  Tr,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { Users } from "tabler-icons-react";

import H3 from "#/blocks/H3";
import { getConfig } from "#/hooks/useBooleanConfig";
import { LogDBProps, PlayerDBProps } from "#/utils/db";

type GameLogsProps = {
  players: PlayerDBProps[];
  logs: LogDBProps[];
};

const AnswerPlayerTable: React.FC<GameLogsProps> = ({ players, logs }) => {
  const { colorMode } = useColorMode();
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  if (!getConfig("scorewatcher-show-logs")) return null;

  return (
    <Box p={1}>
      <H3 sx={{ display: "flex", gap: 3, p: 3 }}>
        <Users />
        解答者一覧
      </H3>
      <Box
        sx={{
          borderStyle: "solid",
          borderWidth: 3,
          borderColor:
            colorMode === "light"
              ? theme.colors.gray[50]
              : theme.colors.gray[700],
          p: 3,
          borderRadius: isLargerThan700 ? "1rem" : "0.5rem",
        }}
      >
        {logs.length !== 0 ? (
          <>
            <p>コピーして Excel 等に貼り付けできます。</p>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Tbody>
                  {logs.map((log, qn) => (
                    <Tr key={log.id}>
                      <Td>{qn + 1}.</Td>
                      <Td>
                        {
                          players
                            .find((p) => p.id === log.player_id)
                            ?.name.split(" ")[0]
                            .split("　")[0]
                        }
                      </Td>
                    </Tr>
                  ))}
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

export default AnswerPlayerTable;
