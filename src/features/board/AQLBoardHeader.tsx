import { useEffect, useState } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  FormControl,
  FormLabel,
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

import Button from "#/components/Button";
import ShortcutGuide from "#/features/board/ShortcutGuide";
import useDeviceWidth from "#/features/hooks/useDeviceWidth";
import db from "#/utils/db";
import { showQnAtom } from "#/utils/jotai";
import { LogDBProps, QuizDBProps } from "#/utils/types";
import { css } from "@panda/css";

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
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  const isDesktop = useDeviceWidth();
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

  const qn = logs.filter((log) => log.variant !== "skip").length;

  return (
    <>
      <div
        className={css({
          display: "flex",
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
        })}
      >
        <div
          className={css({
            display: "flex",
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
          })}
        >
          <h2 className="p0">{name}</h2>
          <p>AQL</p>
        </div>
        {isDesktop && (
          <>
            {showQn && (
              <div className={css({ whiteSpace: "nowrap" })}>
                第
                <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>
                  {logs.length + 1}
                </span>
                問
              </div>
            )}
            {quiz_set && quizList.length > logs.length && (
              <div
                className={css({
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  fontSize: "1.5rem",
                  lineHeight: "1.5rem",
                  overflow: "hidden",
                })}
              >
                <div className={css({ maxHeight: "8vh" })}>
                  {qn === 0
                    ? "ここに問題文が表示されます"
                    : quizList[quiz_offset + qn - 1].q}
                </div>
                <div
                  className={css({
                    textAlign: "right",
                    color: "red.600",
                    bgColor: "gray.50",
                    fontWeight: 800,
                    _dark: {
                      color: "red.300",
                      bgColor: "gray.700",
                    },
                  })}
                >
                  {qn === 0
                    ? "ここに答えが表示されます"
                    : quizList[quiz_offset + qn - 1].a}
                </div>
              </div>
            )}
          </>
        )}
        <div>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              className={css({
                borderColor: "gray.300",
                _dark: {
                  borderColor: "gray.500",
                },
              })}
              leftIcon={<Settings />}
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
                  className={css({
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <FormLabel mb="0">試合を終了</FormLabel>
                  <Switch isChecked={end} />
                </FormControl>
              </MenuItem>
              {isDesktop && (
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
        </div>
      </div>
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
