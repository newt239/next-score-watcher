import { useEffect, useState } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  theme,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import {
  AdjustmentsHorizontal,
  ArrowBackUp,
  Comet,
  Command,
  Home,
  PlayerStop,
  Settings,
} from "tabler-icons-react";

import ShortcutGuide from "#/components/ShortcutGuide";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { showQnAtom } from "#/utils/jotai";
import { LogDBProps, QuizDBProps } from "#/utils/types";

type AQLBoardHeaderProps = {
  name: string;
  game_id: string;
  logs: LogDBProps[];
  quiz_set?: string;
  quiz_offset: number;
  end: boolean;
  onEndChange: () => void;
};

const AQLBoardHeader: React.FC<AQLBoardHeaderProps> = ({
  name,
  game_id,
  logs,
  quiz_set,
  quiz_offset,
  end,
  onEndChange,
}) => {
  const { colorMode } = useColorMode();
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  const desktop = useDeviceWidth();
  const showQn = useAtomValue(showQnAtom);
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
          height: desktop ? "15vh" : "10vh",
          px: 1,
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
            borderWidth: desktop ? "thin" : 0,
            borderColor:
              colorMode === "light"
                ? theme.colors.gray[300]
                : theme.colors.gray[500],
            borderRadius: "1rem",
            padding: desktop ? 3 : undefined,
            maxWidth: "70vw",
          }}
        >
          <h2 className="p0">{name}</h2>
          <p>AQL</p>
        </Box>
        {desktop && (
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
                <Box sx={{ maxHeight: "8vh" }}>
                  {logs.length === 0
                    ? "ここに問題文が表示されます"
                    : quizList[quiz_offset + logs.length - 1].q}
                </Box>
                <Box
                  sx={{
                    textAlign: "right",
                    color: theme.colors.red[colorMode === "light" ? 600 : 300],
                    fontWeight: 800,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        colorMode === "light"
                          ? theme.colors.gray[50]
                          : theme.colors.gray[700],
                    }}
                  >
                    {logs.length === 0
                      ? "ここに答えが表示されます"
                      : quizList[quiz_offset + logs.length - 1].a}
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
        <Box>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={IconButton}
              icon={<Settings />}
              sx={{
                borderColor:
                  colorMode === "light"
                    ? theme.colors.gray[300]
                    : theme.colors.gray[500],
              }}
              variant="outline"
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
                disabled={logs.length === 0}
                icon={<ArrowBackUp />}
                onClick={async () => {
                  if (logs.length !== 0) {
                    await db.logs.delete(logs[logs.length - 1].id);
                  }
                }}
              >
                一つ戻す
              </MenuItem>
              <MenuItem icon={<PlayerStop />} onClick={onEndChange}>
                <FormControl
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel mb="0">試合を終了</FormLabel>
                  <Switch isChecked={end} />
                </FormControl>
              </MenuItem>
              {desktop && (
                <MenuItem closeOnSelect icon={<Command />} onClick={onOpen}>
                  ショートカットを確認
                </MenuItem>
              )}
              <MenuItem
                as={ReactLink}
                icon={<AdjustmentsHorizontal />}
                to={`/aql`}
              >
                AQL設定
              </MenuItem>
              <MenuItem as={ReactLink} icon={<Home />} to="/">
                ホームに戻る
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ショートカットキー一覧</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShortcutGuide />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                onClose();
                document.getElementById("players-area")?.focus();
              }}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AQLBoardHeader;
