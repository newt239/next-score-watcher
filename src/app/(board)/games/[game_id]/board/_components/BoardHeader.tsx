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
} from "tabler-icons-react";

import PreferenceDrawer from "./PreferenceDrawer";

import Link from "@/app/_components/Link";
import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";
import { GamePropsUnion, LogDBProps, QuizDBProps } from "@/utils/types";

type BoardHeaderProps = {
  game: GamePropsUnion;
  logs: LogDBProps[];
};

const BoardHeader: React.FC<BoardHeaderProps> = ({ game, logs }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  const [manualQuizPosition, setManualQuizPosition] = useState(0);

  const [opened, { open, close }] = useDisclosure(false);

  const showQn = useLocalStorage({
    key: "scorew_show_qn",
    defaultValue: true,
  });

  useEffect(() => {
    const getQuizList = async () => {
      if (game.quiz) {
        setQuizList(
          await db().quizes.where({ set_name: game.quiz.set_name }).sortBy("n")
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
    if (game.quiz) {
      setManualQuizPosition(game.quiz.offset + qn);
    }
  }, [game.editable]);

  if (!game || !logs) return null;

  return (
    <>
      <Flex className="h-[10vh] items-center justify-between gap-0 border-b border-gray-300 bg-gray-50 px-1 lg:h-[15vh] lg:gap-3 dark:border-gray-500 dark:bg-gray-700">
        <Flex
          className="h-full flex-col justify-center p-0 text-green-600 dark:text-green-300"
          style={{
            maxWidth: `calc(100vw - ${showQn ? 10 : 3}rem)`,
          }}
        >
          <h2 style={{ lineHeight: "2rem", overflow: "hidden" }}>
            {game.name}
          </h2>
          <p>{getRuleStringByType(game)}</p>
        </Flex>
        {showQn && (
          <Flex className="flex-col items-center justify-center">
            <Box className="whitespace-nowrap leading-10">
              第
              <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>
                {game.editable ? manualQuizPosition + 1 : qn + 1}
              </span>
              問
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
                  disabled={manualQuizPosition >= quizList.length - 1}
                  onClick={() => setManualQuizPosition((v) => v + 1)}
                >
                  {">"}
                </Button>
              </Button.Group>
            )}
          </Flex>
        )}
        {game.quiz && quizList.length > quizPosition && (
          <Box className="hidden h-full grow flex-col justify-between overflow-hidden text-lg leading-6 lg:flex">
            <Box className="leading-[8vh]">
              {qn === 0 || quizPosition < 0
                ? "ここに問題文が表示されます"
                : quizList[quizPosition].q}
            </Box>
            <Box className="bg-gray-50 text-right font-bold text-red-600 dark:bg-gray-700 dark:text-red-300">
              {qn === 0 || quizPosition < 0
                ? "ここに答えが表示されます"
                : quizList[quizPosition].a}
            </Box>
          </Box>
        )}
        <Menu>
          <Menu.Target>
            <ActionIcon>
              <Settings />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<Comet />}
              disabled={game.editable}
              onClick={async () => {
                try {
                  await db().logs.put({
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
              leftSection={<ArrowBackUp />}
              disabled={logs.length === 0 || game.editable}
              onClick={async () => {
                if (logs.length !== 0) {
                  await db().logs.delete(logs[logs.length - 1].id);
                }
              }}
            >
              一つ戻す
            </Menu.Item>
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
            <Menu.Item closeMenuOnClick leftSection={<Ballon />} onClick={open}>
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
