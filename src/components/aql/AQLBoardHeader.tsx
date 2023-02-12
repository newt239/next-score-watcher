import NextLink from "next/link";
import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  theme,
  useColorMode,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";
import { ArrowBackUp, Comet, Home, Settings } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import db, { LogDBProps, QuizDBProps } from "#/utils/db";

type AQLBoardHeaderProps = {
  name: string;
  game_id: string;
  logs: LogDBProps[];
  quiz_set?: string;
  quiz_offset: number;
};

const AQLBoardHeader: React.FC<AQLBoardHeaderProps> = ({
  name,
  game_id,
  logs,
  quiz_set,
  quiz_offset,
}) => {
  const { colorMode } = useColorMode();
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getQuizList = async () => {
      if (quiz_set) {
        setQuizList(await db.quizes.where({ set_name: quiz_set }).sortBy("n"));
      }
    };
    getQuizList();
  }, [quiz_set]);

  if (!logs) return null;

  return (
    <>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          height: isLargerThan700 ? "15vh" : "10vh",
          px: 3,
          borderStyle: "solid",
          borderWidth: "0px 0px thin",
          borderColor:
            colorMode === "light"
              ? theme.colors.gray[300]
              : theme.colors.gray[500],
          backgroundColor:
            colorMode === "light"
              ? theme.colors.gray[50]
              : theme.colors.gray[700],
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderStyle: "solid",
            borderWidth: isLargerThan700 ? "thin" : 0,
            borderColor:
              colorMode === "light"
                ? theme.colors.gray[300]
                : theme.colors.gray[500],
            borderRadius: "1rem",
            padding: isLargerThan700 ? 3 : undefined,
            maxWidth: "70vw",
          }}
        >
          <H2
            sx={{
              pt: 0,
              whiteSpace: "nowrap",
              overflowX: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </H2>
          <p>AQL</p>
        </Box>
        {isLargerThan700 && (
          <>
            <Box sx={{ whiteSpace: "nowrap" }}>
              第
              <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>
                {logs.length + 1}
              </span>
              問
            </Box>
            {quiz_set && quizList.length > logs.length && (
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
                    : quizList[quiz_offset + logs.length - 1].q}
                </div>
                <div
                  style={{
                    textAlign: "right",
                    color: theme.colors.red[500],
                    fontWeight: 800,
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        colorMode === "light"
                          ? theme.colors.gray[50]
                          : theme.colors.gray[700],
                    }}
                  >
                    {logs.length === 0
                      ? "ここに答えが表示されます"
                      : quizList[quiz_offset + logs.length - 1].a}
                  </span>
                </div>
              </Box>
            )}
          </>
        )}
        <Box>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={IconButton}
              icon={<Settings />}
              variant="outline"
              sx={{
                borderColor:
                  colorMode === "light"
                    ? theme.colors.gray[300]
                    : theme.colors.gray[500],
              }}
            />
            <MenuList>
              <MenuItem
                icon={<Comet />}
                onClick={async () => {
                  try {
                    await db.logs.put({
                      id: nanoid(),
                      game_id: game_id,
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
              <NextLink href="/">
                <MenuItem icon={<Home />}>ホームに戻る</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </>
  );
};

export default AQLBoardHeader;
