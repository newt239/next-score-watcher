import { useEffect, useState } from "react";

import { Button, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import { cdate } from "cdate";
import { SortAscending, SortDescending } from "tabler-icons-react";

import { css } from "@panda/css";
import useDeviceWidth from "~/hooks/useDeviceWidth";
import db from "~/utils/db";
import { LogDBProps, QuizDBProps } from "~/utils/types";

type GameLogsProps = {
  players: { id: string; name: string }[];
  logs: LogDBProps[];
  quiz: { set_name: string; offset: number } | undefined;
};

const GameLogs: React.FC<GameLogsProps> = ({ players, logs, quiz }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  const desktop = useDeviceWidth();
  const [reverse, setReverse] = useState<Boolean>(true);

  useEffect(() => {
    const getQuizes = async () => {
      if (quiz) {
        setQuizList(
          await db.quizes.where({ set_name: quiz.set_name }).sortBy("n")
        );
      }
    };
    getQuizes();
  }, [quiz]);

  const containSkipLog = logs.some((log) => log.variant === "skip");

  return (
    <div
      className={css({
        display: "flex",
        p: 3,
        my: 10,
        maxW: "100vw",
        justifyContent: "center",
      })}
    >
      <div
        className={css({
          borderStyle: "solid",
          borderWidth: desktop ? 3 : 1,
          borderColor: "gray.100",
          p: 3,
          borderRadius: desktop ? "1rem" : "0.5rem",
          _dark: {
            borderColor: "gray.700",
          },
        })}
      >
        <Button
          leftIcon={reverse ? <SortAscending /> : <SortDescending />}
          onClick={() => setReverse((v) => !v)}
          size="sm"
          sx={{ mb: 2 }}
        >
          {reverse ? "降順" : "昇順"}
        </Button>
        {logs.length !== 0 ? (
          <>
            <TableContainer>
              <Table size="sm" variant="simple">
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
                          {!containSkipLog && quizList.length > qn && (
                            <>
                              <Td>
                                {
                                  quizList[reverse ? logs.length - qn - 1 : qn]
                                    ?.q
                                }
                              </Td>
                              <Td>
                                {
                                  quizList[reverse ? logs.length - qn - 1 : qn]
                                    ?.a
                                }
                              </Td>
                            </>
                          )}
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
      </div>
    </div>
  );
};

export default GameLogs;
