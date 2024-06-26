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

import ShortcutGuide from "~/features/board/ShortcutGuide";
import db from "~/utils/db";
import { showQnAtom } from "~/utils/jotai";
import { LogDBProps, QuizDBProps } from "~/utils/types";

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
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  const showQn = useAtomValue(showQnAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getQuizList = async () => {
      if (quiz_set) {
        setQuizList(
          await db(currentProfile)
            .quizes.where({ set_name: quiz_set })
            .sortBy("n")
        );
      }
    };
    getQuizList();
  }, [quiz_set]);

  if (!logs) return null;

  const qn = logs.filter((log) => log.variant !== "skip").length;

  return (
    <>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          height: ["10vh", "10vh", "15vh"],
          px: 1,
          borderStyle: "solid",
          borderWidth: "0px 0px thin",
          borderColor: "gray.300",
          bgColor: "gray.50",
          overflow: "hidden",
          _dark: {
            borderColor: "gray.500",
            bgColor: "gray.700",
          },
        }}
      >
        <Flex
          sx={{
            flexDirection: "column",
            justifyContent: "center",
            borderStyle: "solid",
            borderWidth: [0, 0, "thin"],
            borderColor: "gray.300",
            borderRadius: "xl",
            p: [0, 0, 3],
            maxW: "70vw",
            maxH: "95%",
            overflow: "hidden",
            _dark: {
              borderColor: "gray.500",
            },
          }}
        >
          <h2 className="p0">{name}</h2>
          <p>AQL</p>
        </Flex>
        {showQn && (
          <Box sx={{ whiteSpace: "nowrap", display: ["none", "block"] }}>
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
              display: ["none", "flex"],
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              fontSize: "1.5rem",
              lineHeight: "1.5rem",
              overflow: "hidden",
            }}
          >
            <Box sx={{ maxHeight: "8vh" }}>
              {qn === 0
                ? "ここに問題文が表示されます"
                : quizList[quiz_offset + qn - 1].q}
            </Box>
            <Box
              sx={{
                textAlign: "right",
                color: "red.600",
                bgColor: "gray.50",
                fontWeight: 800,
                _dark: {
                  color: "red.300",
                  bgColor: "gray.700",
                },
              }}
            >
              {qn === 0
                ? "ここに答えが表示されます"
                : quizList[quiz_offset + qn - 1].a}
            </Box>
          </Box>
        )}
        <Box>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={IconButton}
              icon={<Settings />}
              sx={{
                borderColor: "gray.300",
                _dark: {
                  borderColor: "gray.500",
                },
              }}
              variant="outline"
            />
            <MenuList>
              <MenuItem
                icon={<Comet />}
                onClick={async () => {
                  try {
                    await db(currentProfile).logs.put({
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
                    await db(currentProfile).logs.delete(
                      logs[logs.length - 1].id
                    );
                  }
                }}
              >
                一つ戻す
              </MenuItem>
              <MenuItem icon={<PlayerStop />} onClick={onEndChange}>
                <FormControl
                  as={Flex}
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel mb="0">試合を終了</FormLabel>
                  <Switch isChecked={end} />
                </FormControl>
              </MenuItem>
              <MenuItem
                closeOnSelect
                icon={<Command />}
                onClick={onOpen}
                sx={{ display: ["none", "none", "block"] }}
              >
                ショートカットを確認
              </MenuItem>
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
