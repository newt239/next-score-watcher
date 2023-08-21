import { useEffect, useState } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import {
  AdjustmentsHorizontal,
  ArrowBackUp,
  Ballon,
  Comet,
  HandClick,
  Settings,
} from "tabler-icons-react";

import PreferenceModal from "#/components/board/PreferenceModal";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { recordEvent } from "#/utils/ga4";
import { showQnAtom } from "#/utils/jotai";
import { getRuleStringByType } from "#/utils/rules";
import { GamePropsUnion, LogDBProps, QuizDBProps } from "#/utils/types";

type BoardHeaderProps = {
  game: GamePropsUnion;
  logs: LogDBProps[];
};

const BoardHeader: React.FC<BoardHeaderProps> = ({ game, logs }) => {
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);
  const [manualQuizPosition, setManualQuizPosition] = useState(0);

  const isDesktop = useDeviceWidth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showQn = useAtomValue(showQnAtom);

  useEffect(() => {
    const getQuizList = async () => {
      if (game.quiz) {
        setQuizList(
          await db.quizes.where({ set_name: game.quiz.set_name }).sortBy("n")
        );
      }
    };
    getQuizList();
  }, [game.quiz]);

  const qn = logs.filter((log) => log.variant !== "skip").length;
  const quizPosition = game.editable
    ? manualQuizPosition
    : game.quiz
    ? game.quiz.offset + qn - 1
    : 0;

  useEffect(() => {
    if (game.quiz) {
      setManualQuizPosition(game.quiz.offset + qn - 1);
    }
  }, [game.editable]);

  if (!game || !logs) return null;

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
          <h2 style={{ lineHeight: "2rem" }}>{game.name}</h2>
          <p>{getRuleStringByType(game)}</p>
        </Flex>
        {isDesktop && (
          <>
            {showQn && (
              <Flex sx={{ flexDirection: "column", justifyContent: "center" }}>
                <Box sx={{ whiteSpace: "nowrap" }}>
                  第
                  <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>
                    {game.editable ? manualQuizPosition : logs.length + 1}
                  </span>
                  問
                </Box>
                {game.editable && (
                  <ButtonGroup
                    isAttached
                    justifyContent="center"
                    size="sm"
                    variant="outline"
                  >
                    <Button
                      isDisabled={manualQuizPosition <= 0}
                      onClick={() => setManualQuizPosition((v) => v - 1)}
                    >
                      {"<"}
                    </Button>
                    <Button
                      isDisabled={manualQuizPosition >= quizList.length - 1}
                      onClick={() => setManualQuizPosition((v) => v + 1)}
                    >
                      {">"}
                    </Button>
                  </ButtonGroup>
                )}
              </Flex>
            )}
            {game.quiz && quizList.length > quizPosition && (
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
                  {qn === 0
                    ? "ここに問題文が表示されます"
                    : quizList[quizPosition].q}
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
                    : quizList[quizPosition].a}
                </Box>
              </Box>
            )}
          </>
        )}
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
              isDisabled={game.editable}
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
              isDisabled={logs.length === 0 || game.editable}
              onClick={async () => {
                if (logs.length !== 0) {
                  await db.logs.delete(logs[logs.length - 1].id);
                  recordEvent({
                    action: "undo_log",
                    category: "engagement",
                    label: game.rule,
                  });
                }
              }}
            >
              一つ戻す
            </MenuItem>
            <MenuItem
              icon={<HandClick />}
              onClick={async () => {
                await db.games.update(game.id, {
                  editable: !game.editable,
                });
                recordEvent({
                  action: "switch_editable",
                  category: "engagement",
                  label: game.rule,
                });
              }}
            >
              <FormControl
                as={Flex}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormLabel mb="0">スコアの手動更新</FormLabel>
                <Switch isChecked={game.editable} />
              </FormControl>
            </MenuItem>
            <MenuItem closeOnSelect icon={<Ballon />} onClick={onOpen}>
              表示設定
            </MenuItem>
            <MenuDivider />
            <MenuItem
              as={ReactLink}
              icon={<AdjustmentsHorizontal />}
              to={`/${game.id}/config`}
            >
              ゲーム設定
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <PreferenceModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default BoardHeader;
