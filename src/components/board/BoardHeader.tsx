import NextLink from "next/link";
import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";
import {
  AdjustmentsHorizontal,
  ArrowBackUp,
  Comet,
  Command,
  HandClick,
  Home,
  Settings,
  Number,
} from "tabler-icons-react";

import ShortcutGuideModal from "./ShortcutGuideModal";

import H2 from "#/blocks/H2";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db, { GameDBProps, LogDBProps, QuizDBProps } from "#/utils/db";
import { getRuleStringByType } from "#/utils/rules";
import { colors } from "#/utils/theme";

type BoardHeaderProps = {
  game: GameDBProps;
  logs: LogDBProps[];
};

const BoardHeader: React.FC<BoardHeaderProps> = ({ game, logs }) => {
  const { colorMode } = useColorMode();
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  const desktop = useDeviceWidth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showQn, setShowQn] = useState<boolean>(true);

  useEffect(() => {
    const getQuizList = async () => {
      if (game.quiz) {
        setQuizList(
          await db.quizes.where({ set_name: game.quiz.set_name }).sortBy("n")
        );
      }
    };
    getQuizList();
  }, [game]);

  if (!game || !logs) return null;

  return (
    <>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          height: desktop ? "15vh" : "10vh",
          px: 3,
          borderStyle: "solid",
          borderWidth: "0px 0px thin",
          borderColor:
            colorMode === "light" ? colors.gray[300] : colors.gray[500],
          backgroundColor:
            colorMode === "light" ? colors.gray[50] : colors.gray[700],
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderStyle: "solid",
            borderWidth: desktop ? "thin" : 0,
            borderColor:
              colorMode === "light" ? colors.gray[300] : colors.gray[500],
            borderRadius: "1rem",
            padding: desktop ? 3 : undefined,
            maxWidth: "70vw",
          }}
        >
          <H2 pt={0}>{game.name}</H2>
          <p>{getRuleStringByType(game)}</p>
        </Box>
        {game.editable ||
          (desktop && (
            <>
              {showQn && (
                <Box sx={{ whiteSpace: "nowrap" }}>
                  第
                  <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>
                    {logs.length + 1}
                  </span>
                  問
                </Box>
              )}
              {game.quiz && quizList.length > logs.length && (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    fontSize: "1.5rem",
                    lineHeight: "1.5rem",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ maxHeight: "8vh" }}>
                    {logs.length === 0
                      ? "ここに問題文が表示されます"
                      : quizList[game.quiz.offset + logs.length - 1].q}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      color: colors.red[colorMode],
                      fontWeight: 800,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          colorMode === "light"
                            ? colors.gray[50]
                            : colors.gray[700],
                      }}
                    >
                      {logs.length === 0
                        ? "ここに答えが表示されます"
                        : quizList[game.quiz.offset + logs.length - 1].a}
                    </span>
                  </div>
                </Box>
              )}
            </>
          ))}
        <Box>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={IconButton}
              icon={<Settings />}
              variant="outline"
              sx={{
                borderColor:
                  colorMode === "light" ? colors.gray[300] : colors.gray[500],
              }}
            />
            <MenuList>
              <MenuItem
                icon={<Comet />}
                onClick={async () => {
                  try {
                    await db.logs.put({
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
              </MenuItem>
              <MenuItem
                icon={<ArrowBackUp />}
                disabled={logs.length === 0}
                onClick={async () => {
                  if (logs.length !== 0) {
                    await db.logs.delete(logs[logs.length - 1].id);
                  }
                }}
              >
                一つ戻す
              </MenuItem>
              <MenuItem
                icon={<HandClick />}
                onClick={async () =>
                  await db.games.update(game.id, {
                    editable: !game.editable,
                  })
                }
              >
                <FormControl
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel mb="0">スコアの手動更新</FormLabel>
                  <Switch isChecked={game.editable} />
                </FormControl>
              </MenuItem>
              <MenuItem icon={<Number />} onClick={() => setShowQn((v) => !v)}>
                <FormControl
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel mb="0">問題番号を表示</FormLabel>
                  <Switch isChecked={showQn} />
                </FormControl>
              </MenuItem>
              {desktop && (
                <MenuItem closeOnSelect icon={<Command />} onClick={onOpen}>
                  ショートカットを確認
                </MenuItem>
              )}
              <NextLink href={`/${game.id}/config`}>
                <MenuItem icon={<AdjustmentsHorizontal />}>設定</MenuItem>
              </NextLink>
              <NextLink href="/">
                <MenuItem icon={<Home />}>ホームに戻る</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <ShortcutGuideModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default BoardHeader;
