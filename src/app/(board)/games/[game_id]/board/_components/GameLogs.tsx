"use client";

import { useEffect, useState } from "react";

import { cdate } from "cdate";
import { SortAscending, SortDescending } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import { GameLogPropsOnSupabase, QuizDBProps } from "#/utils/types";
import { css } from "@panda/css";

type GameLogsProps = {
  players: { id: string; name: string }[];
  logs: GameLogPropsOnSupabase[];
  quiz: { set_name: string; offset: number } | null;
};

const GameLogs: React.FC<GameLogsProps> = ({ players, logs, quiz }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  const [reverse, setReverse] = useState<Boolean>(true);

  useEffect(() => {
    const getQuizes = async () => {
      if (quiz) {
        setQuizList([]);
        // await db.quizes.where({ set_name: quiz.set_name }).sortBy("n")
      }
    };
    getQuizes();
  }, [quiz]);

  const containSkipLog = logs.some((log) => log.variant === "skip");

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        maxW: "100vw",
        my: 10,
        p: 3,
      })}
    >
      <div
        className={css({
          _dark: {
            borderColor: "gray.700",
          },
          borderColor: "gray.100",
          borderRadius: "0.5rem",
          borderStyle: "solid",
          borderWidth: 1,
          lg: {
            borderRadius: "1rem",
            borderWidth: 3,
          },
          p: 3,
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
          <div>
            <table>
              <tbody>
                {
                  // https://qiita.com/seltzer/items/2f9ee13cf085966f1a4c
                  (reverse ? logs.slice().reverse() : logs).map((log, qn) => {
                    const player = players.find((p) => p.id === log.player_id);
                    return (
                      <tr key={log.id}>
                        <td>{reverse ? logs.length - qn : qn + 1}.</td>
                        <td>{player ? player.name : "-"}</td>
                        <td>
                          {log.variant === "correct"
                            ? "o"
                            : log.variant === "wrong"
                              ? "x"
                              : "-"}
                        </td>
                        <td
                          title={cdate(log.timestamp).format(
                            "YYYY年MM月DD日 HH時mm分ss秒"
                          )}
                        >
                          {cdate(log.timestamp).format("HH:mm:ss")}
                        </td>
                        {!containSkipLog && quizList.length > qn && (
                          <>
                            <td>
                              {quizList[reverse ? logs.length - qn - 1 : qn]?.q}
                            </td>
                            <td>
                              {quizList[reverse ? logs.length - qn - 1 : qn]?.a}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        ) : (
          <p>ここに解答者の一覧が表示されます。</p>
        )}
      </div>
    </div>
  );
};

export default GameLogs;
