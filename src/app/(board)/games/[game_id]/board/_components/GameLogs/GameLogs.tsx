"use client";

import { useEffect, useState } from "react";

import { Box, Button, Group, Table, Text } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { cdate } from "cdate";

import classes from "./GameLogs.module.css";

import db from "@/utils/db";
import { LogDBProps, QuizDBProps } from "@/utils/types";

type Props = {
  players: { id: string; name: string }[];
  logs: LogDBProps[];
  quiz: { set_name: string; offset: number } | undefined;
  currentProfile: string;
};

const GameLogs: React.FC<Props> = ({ players, logs, quiz, currentProfile }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [reverse, setReverse] = useState<boolean>(true);

  useEffect(() => {
    const getQuizes = async () => {
      if (quiz) {
        setQuizList(
          await db(currentProfile)
            .quizes.where({ set_name: quiz.set_name })
            .sortBy("n")
        );
      }
    };
    getQuizes();
  }, [quiz]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const containSkipLog = logs.some((log) => log.variant === "skip");
  const filterdLogs = logs.filter((log) => log.variant !== "multiple_wrong");

  return (
    <Box className={classes.game_logs}>
      <Group justify="space-between" mb="1rem">
        <Text fw={700}>Game Logs</Text>
        <Group>
          <Button
            size="xs"
            onClick={() => {
              const logsWithTableFormat = `<table>${(reverse
                ? filterdLogs.slice().reverse()
                : filterdLogs
              ).map((log, qn) => {
                const player = players.find((p) => p.id === log.player_id);
                return `
                <tr>
                  <td>${reverse ? filterdLogs.length - qn : qn + 1}.</td>
                  <td>${
                    player
                      ? player.name
                      : log.variant === "through"
                        ? "(スルー)"
                        : "-"
                  }</td>
                  <td>${
                    log.variant === "correct"
                      ? "o"
                      : log.variant === "wrong"
                        ? "x"
                        : "-"
                  }</td>
                  <td>${cdate(log.timestamp).format("YYYY/MM/DD HH:mm:ss")}</td>
                  ${
                    !containSkipLog && quizList.length > qn
                      ? `
                    <td>${
                      quizList[reverse ? filterdLogs.length - qn - 1 : qn]?.q
                    }</td>
                    <td>${
                      quizList[reverse ? filterdLogs.length - qn - 1 : qn]?.a
                    }</td>
                  `
                      : ""
                  }
                </tr>`;
              })}
            </table>`;
              const blob = new Blob([logsWithTableFormat], {
                type: "text/html",
              });
              window.navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob }),
              ]);
              setCopied(true);
            }}
            leftSection={
              copied ? <IconCheck size={20} /> : <IconCopy size={20} />
            }
          >
            コピーする
          </Button>
          <Button
            leftSection={
              reverse ? (
                <IconSortAscending size={20} />
              ) : (
                <IconSortDescending size={20} />
              )
            }
            onClick={() => setReverse((v) => !v)}
            size="xs"
          >
            {reverse ? "降順" : "昇順"}
          </Button>
        </Group>
      </Group>
      {filterdLogs.length !== 0 ? (
        <Table.ScrollContainer minWidth={1000}>
          <Table highlightOnHover>
            <Table.Tbody>
              {
                // https://qiita.com/seltzer/items/2f9ee13cf085966f1a4c
                (reverse ? filterdLogs.slice().reverse() : filterdLogs).map(
                  (log, qn) => {
                    const player = players.find((p) => p.id === log.player_id);
                    return (
                      <Table.Tr key={log.id}>
                        <Table.Td>
                          {reverse ? filterdLogs.length - qn : qn + 1}.
                        </Table.Td>
                        <Table.Td>
                          {player
                            ? player.name
                            : log.variant === "through"
                              ? "(スルー)"
                              : "-"}
                        </Table.Td>
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
                              {
                                quizList[
                                  reverse ? filterdLogs.length - qn - 1 : qn
                                ]?.q
                              }
                            </Table.Td>
                            <Table.Td>
                              {
                                quizList[
                                  reverse ? filterdLogs.length - qn - 1 : qn
                                ]?.a
                              }
                            </Table.Td>
                          </>
                        )}
                      </Table.Tr>
                    );
                  }
                )
              }
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : (
        <p>ここに解答者の一覧が表示されます。</p>
      )}
    </Box>
  );
};

export default GameLogs;
