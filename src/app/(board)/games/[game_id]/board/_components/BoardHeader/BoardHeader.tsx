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
import { cdate } from "cdate";
import { nanoid } from "nanoid";
import {
  AdjustmentsHorizontal,
  ArrowBackUp,
  Ballon,
  Comet,
  Maximize,
  Settings,
  Square,
  SquareCheck,
} from "tabler-icons-react";

import PreferenceDrawer from "../PreferenceDrawer";

import classes from "./BoardHeader.module.css";

import Link from "@/app/_components/Link";
import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";
import { GamePropsUnion, LogDBProps, QuizDBProps } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  logs: LogDBProps[];
  currentProfile: string;
};

const BoardHeader: React.FC<Props> = ({ game, logs, currentProfile }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  const [manualQuizPosition, setManualQuizPosition] = useState(0);

  const [opened, { open, close }] = useDisclosure(false);

  const showQn = useLocalStorage({
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

  if (!game || !logs) return null;

  return (
    <>
      <Flex className={classes.board_header}>
        <Flex
          className={classes.game_info_area}
          style={{
            maxWidth: `calc(100vw - ${showQn ? 10 : 3}rem)`,
          }}
        >
          <div className={classes.game_name}>{game.name}</div>
          <div>{getRuleStringByType(game)}</div>
        </Flex>
        {showQn && (
          <Flex className={classes.quiz_number_area}>
            <Box className={classes.quiz_number}>
              第<span>{game.editable ? manualQuizPosition + 1 : qn + 1}</span>問
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
        {game.quiz && quizList.length > quizPosition && (
          <Box className={classes.quiz_area}>
            <Box className={classes.quiz}>
              {qn === 0 || quizPosition < 0
                ? "ここに問題文が表示されます"
                : quizList[quizPosition].q}
            </Box>
            <Box className={classes.answer}>
              {qn === 0 || quizPosition < 0
                ? "ここに答えが表示されます"
                : quizList[quizPosition].a}
            </Box>
          </Box>
        )}
        <Menu>
          <Menu.Target>
            <ActionIcon variant="subtle" size="xl" color="teal">
              <Settings />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              closeMenuOnClick={false}
              leftSection={<Comet />}
              disabled={game.editable}
              onClick={async () => {
                try {
                  await db(currentProfile).logs.put({
                    id: nanoid(),
                    game_id: game.id,
                    player_id: "-",
                    variant: "through",
                    system: false,
                    timestamp: cdate().text(),
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
              leftSection={<ArrowBackUp />}
              disabled={logs.length === 0 || game.editable}
              onClick={async () => {
                if (logs.length !== 0) {
                  await db(currentProfile).logs.delete(
                    logs[logs.length - 1].id
                  );
                }
              }}
            >
              一つ戻す
            </Menu.Item>
            {game.rule !== "aql" && (
              <Menu.Item
                leftSection={game.editable ? <SquareCheck /> : <Square />}
                onClick={async () => {
                  try {
                    await db(currentProfile).games.put({
                      ...game,
                      editable: !game.editable,
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
                leftSection={<Maximize />}
                onClick={() => {
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
            <Menu.Item leftSection={<Ballon />} onClick={open}>
              表示設定
            </Menu.Item>
            <MenuDivider />
            <Menu.Item
              component={Link}
              leftSection={<AdjustmentsHorizontal />}
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
