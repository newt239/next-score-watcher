"use client";

import { useEffect, useState } from "react";

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Menu,
  MenuDivider,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { sendGAEvent } from "@next/third-parties/google";
import {
  IconAdjustmentsHorizontal,
  IconArrowBackUp,
  IconBalloon,
  IconComet,
  IconMaximize,
  IconSettings,
  IconSquare,
  IconSquareCheck,
} from "@tabler/icons-react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import PreferenceDrawer from "../PreferenceDrawer";

import classes from "./BoardHeader.module.css";

import type { GamePropsUnion, LogDBProps, QuizDBProps } from "@/utils/types";

import Link from "@/app/_components/Link";
import db from "@/utils/db";
import { getRuleStringByType, rules } from "@/utils/rules";

type Props = {
  game: GamePropsUnion;
  logs: LogDBProps[];
  currentProfile: string;
};

const BoardHeader: React.FC<Props> = ({ game, logs, currentProfile }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  const [manualQuizPosition, setManualQuizPosition] = useState(0);

  const [opened, { open, close }] = useDisclosure(false);

  const [showBoardHeader] = useLocalStorage({
    key: "showBoardHeader",
    defaultValue: true,
  });

  const [showQn] = useLocalStorage({
    key: "showQn",
    defaultValue: true,
  });

  useEffect(() => {
    const getQuizList = async () => {
      if (game.quiz) {
        setQuizList(
          await db(currentProfile)
            .quizes.where({ set_name: game.quiz.set_name })
            .sortBy("n")
        );
      }
    };
    getQuizList();
  }, [game.quiz]);

  const qn = logs.filter(
    (log) =>
      log.variant === "correct" ||
      log.variant === "wrong" ||
      log.variant === "through"
  ).length;
  const quizPosition = game.editable
    ? manualQuizPosition
    : game.quiz
      ? game.quiz.offset + qn - 1
      : 0;

  useEffect(() => {
    setManualQuizPosition((game.quiz ? game.quiz.offset : 0) + qn);
  }, [game.editable]);

  if (!game || !logs || !showBoardHeader) return null;

  return (
    <>
      <Flex
        component="header"
        className={classes.board_header}
        data-withname={
          !(game.name === rules[game.rule].name || game.name === "")
        }
        data-showquiz={game.quiz?.set_name !== "" && game.quiz !== undefined}
        data-showqn={showQn}
      >
        {
          // ゲーム名なしの場合
          game.name === rules[game.rule].name || game.name === "" ? (
            <div className={classes.game_name_only} data-showqn={showQn}>
              <span>Q{game.editable ? manualQuizPosition + 1 : qn + 1}</span>
              <span>{getRuleStringByType(game)}</span>
            </div>
          ) : (
            <Flex className={classes.game_info_wrapper}>
              <Flex className={classes.game_info_area} data-showqn={showQn}>
                <div className={classes.game_name}>{game.name}</div>
                <div>{getRuleStringByType(game)}</div>
              </Flex>
              {showQn && (
                <Flex className={classes.quiz_number_area}>
                  <Box className={classes.quiz_number}>
                    Q{game.editable ? manualQuizPosition + 1 : qn + 1}
                  </Box>
                  {game.editable && (
                    <Button.Group variant="outline">
                      <Button
                        h="auto"
                        disabled={manualQuizPosition < 0}
                        onClick={() => setManualQuizPosition((v) => v - 1)}
                      >
                        {"<"}
                      </Button>
                      <Button
                        h="auto"
                        disabled={
                          game.quiz && manualQuizPosition >= quizList.length - 1
                        }
                        onClick={() => setManualQuizPosition((v) => v + 1)}
                      >
                        {">"}
                      </Button>
                    </Button.Group>
                  )}
                </Flex>
              )}
            </Flex>
          )
        }
        {game.quiz && quizList.length > quizPosition && (
          <Box className={classes.quiz_area}>
            <span>
              {qn === 0 || quizPosition < 0
                ? "ここに問題文が表示されます"
                : quizList[quizPosition].q}
            </span>
            <span className={classes.answer}>
              {qn === 0 || quizPosition < 0
                ? "ここに答えが表示されます"
                : quizList[quizPosition].a}
            </span>
          </Box>
        )}
        <Menu>
          <Menu.Target>
            <ActionIcon
              className={classes.board_action}
              variant="default"
              size="xl"
              color="teal"
              m="xs"
            >
              <IconSettings />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              closeMenuOnClick={false}
              leftSection={<IconComet />}
              disabled={game.editable}
              onClick={async () => {
                try {
                  await db(currentProfile).logs.put({
                    id: nanoid(),
                    game_id: game.id,
                    player_id: "-",
                    variant: "through",
                    system: 0,
                    timestamp: cdate().text(),
                    available: 1,
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              スルー
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick={false}
              leftSection={<IconArrowBackUp />}
              disabled={logs.length === 0 || game.editable}
              onClick={async () => {
                if (logs.length !== 0) {
                  sendGAEvent({
                    event: "undo_log",
                    value: game.rule,
                  });
                  await db(currentProfile).logs.update(
                    logs[logs.length - 1].id,
                    { available: 0 }
                  );
                }
              }}
            >
              一つ戻す
            </Menu.Item>
            {game.rule !== "aql" && (
              <Menu.Item
                leftSection={
                  game.editable ? <IconSquareCheck /> : <IconSquare />
                }
                onClick={async () => {
                  try {
                    await db(currentProfile).games.put({
                      ...game,
                      editable: !game.editable,
                    });
                    sendGAEvent({
                      event: "switch_editable",
                      value: game.rule,
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                スコアの手動更新
              </Menu.Item>
            )}
            {document.fullscreenEnabled && (
              <Menu.Item
                leftSection={<IconMaximize />}
                onClick={() => {
                  sendGAEvent({
                    event: "switch_fullscreen",
                    value: game.rule,
                  });
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
              >
                フルスクリーン
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconBalloon />} onClick={open}>
              表示設定
            </Menu.Item>
            <MenuDivider />
            <Menu.Item
              component={Link}
              leftSection={<IconAdjustmentsHorizontal />}
              href={`/games/${game.id}/config`}
            >
              ゲーム設定
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <PreferenceDrawer isOpen={opened} onClose={close} />
    </>
  );
};

export default BoardHeader;
