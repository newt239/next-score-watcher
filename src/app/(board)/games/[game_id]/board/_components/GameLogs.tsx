"use client";

import { useEffect, useState } from "react";

import { Box, Button, Flex, Table } from "@mantine/core";
import { cdate } from "cdate";
import { SortAscending, SortDescending } from "tabler-icons-react";

import db from "@/utils/db";
import { LogDBProps, QuizDBProps } from "@/utils/types";

type GameLogsProps = {
  players: { id: string; name: string }[];
  logs: LogDBProps[];
  quiz: { set_name: string; offset: number } | undefined;
};

const GameLogs: React.FC<GameLogsProps> = ({ players, logs, quiz }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  const [reverse, setReverse] = useState<Boolean>(true);

  useEffect(() => {
    const getQuizes = async () => {
      if (quiz) {
        setQuizList(
          await db().quizes.where({ set_name: quiz.set_name }).sortBy("n")
        );
      }
    };
    getQuizes();
  }, [quiz]);

  const containSkipLog = logs.some((log) => log.variant === "skip");

  return (
    <Flex className="my-10 max-w-full justify-center p-3">
      <Box className="rounded-md border-solid border-gray-100 p-3 dark:border-gray-700">
        <Button
          leftSection={reverse ? <SortAscending /> : <SortDescending />}
          onClick={() => setReverse((v) => !v)}
          size="md"
          className="mb-2"
        >
          {reverse ? "降順" : "昇順"}
        </Button>
        {logs.length !== 0 ? (
          <Table>
            <Table.Tbody>
              {
                // https://qiita.com/seltzer/items/2f9ee13cf085966f1a4c
                (reverse ? logs.slice().reverse() : logs).map((log, qn) => {
                  const player = players.find((p) => p.id === log.player_id);
                  return (
                    <Table.Tr key={log.id}>
                      <Table.Td>
                        {reverse ? logs.length - qn : qn + 1}.
                      </Table.Td>
                      <Table.Td>{player ? player.name : "-"}</Table.Td>
                      <Table.Td>
                        {log.variant === "correct"
                          ? "o"
                          : log.variant === "wrong"
                          ? "x"
                          : "-"}
                      </Table.Td>
                      <Table.Td
                        title={cdate(log.timestamp).format(
                          "YYYY年MM月DD日 HH時mm分ss秒"
                        )}
                      >
                        {cdate(log.timestamp).format("HH:mm:ss")}
                      </Table.Td>
                      {!containSkipLog && quizList.length > qn && (
                        <>
                          <Table.Td>
                            {quizList[reverse ? logs.length - qn - 1 : qn]?.q}
                          </Table.Td>
                          <Table.Td>
                            {quizList[reverse ? logs.length - qn - 1 : qn]?.a}
                          </Table.Td>
                        </>
                      )}
                    </Table.Tr>
                  );
                })
              }
            </Table.Tbody>
          </Table>
        ) : (
          <p>ここに解答者の一覧が表示されます。</p>
        )}
      </Box>
    </Flex>
  );
};

export default GameLogs;
