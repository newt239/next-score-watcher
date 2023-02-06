import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  FormControl,
  Input,
  FormLabel,
  Stack,
  Link,
  useToast,
  Flex,
  Tooltip,
  Icon,
  Card,
  CardBody,
  useColorMode,
  theme,
  useDisclosure,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import { InfoCircle, Plus, Settings, Upload } from "tabler-icons-react";

import CompactPlayerTable from "./CompactPlayerTable";
import IndividualConfig from "./IndividualConfig";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import db, { GameDBPlayerProps, PlayerDBProps, RuleNames } from "#/utils/db";

const reorder = (
  list: GameDBPlayerProps[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

type SelectPlayerProps = {
  game_id: string;
  rule_name: RuleNames;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
};

const SelectPlayer: React.FC<SelectPlayerProps> = ({
  game_id,
  rule_name,
  playerList,
  players,
  disabled,
}) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerText, setPlayerText] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    if (!playerName) return;
    addNewPlayer();
  };

  const addNewPlayer = async () => {
    const player_id = await db.players.put({
      id: nanoid(),
      name: playerName,
      text: playerText,
      belong: playerBelong,
      tags: [],
    });
    await db.games.update(game_id, {
      players: [
        ...players,
        {
          id: player_id,
          name: playerName,
          initial_correct: 0,
          initial_wrong: 0,
          base_correct_point: 3,
          base_wrong_point: -3,
        } as GameDBPlayerProps,
      ],
    });
    toast({
      title: "プレイヤーを作成しました",
      description: playerName,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setPlayerName("");
    setPlayerText("");
    setPlayerBelong("");
    nameInputRef.current?.focus();
  };

  const onDragEnd = async (result: DropResult) => {
    // ドロップ先がない
    if (!result.destination) {
      return;
    }
    // 配列の順序を入れ替える
    let movedItems = reorder(
      players, // 順序を入れ変えたい配列
      result.source.index, // 元の配列の位置
      result.destination.index // 移動先の配列の位置
    );
    await db.games.update(game_id, {
      players: movedItems,
    });
  };

  return (
    <>
      <H2>プレイヤー設定</H2>
      <Box py={5}>
        {playerList.length === 0 ? (
          <>
            <Button
              onClick={() =>
                router.push({
                  pathname: "/player",
                  query: { from: game_id },
                })
              }
              leftIcon={<Upload />}
              colorScheme="blue"
            >
              プレイヤーデータを読み込む
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setDrawerOpen(true)}
              colorScheme="blue"
              disabled={disabled}
              leftIcon={<Plus />}
            >
              プレイヤーを選択
            </Button>
            <Drawer
              isOpen={drawerOpen}
              placement="right"
              onClose={() => setDrawerOpen(false)}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>プレイヤー選択</DrawerHeader>
                <DrawerBody p={0}>
                  <Accordion defaultIndex={1}>
                    <AccordionItem>
                      <H3 sx={{ pt: 0 }}>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            新しく追加
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </H3>
                      <AccordionPanel pb={4}>
                        <Stack spacing={3}>
                          <FormControl>
                            <FormLabel>氏名</FormLabel>
                            <Input
                              value={playerName}
                              onChange={(v) => setPlayerName(v.target.value)}
                              placeholder="越山識"
                              ref={nameInputRef}
                              onKeyDown={handleKeyDown}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>
                              サブテキスト
                              <Tooltip
                                hasArrow
                                label="ex. ペーパー順位"
                                bg="gray.300"
                                color="black"
                              >
                                <Icon pl={1}>
                                  <InfoCircle />
                                </Icon>
                              </Tooltip>
                            </FormLabel>
                            <Input
                              value={playerText}
                              onChange={(v) => setPlayerText(v.target.value)}
                              placeholder="24th"
                              onKeyDown={handleKeyDown}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>所属</FormLabel>
                            <Input
                              value={playerBelong}
                              onChange={(v) => setPlayerBelong(v.target.value)}
                              placeholder="文蔵高校"
                              onKeyDown={handleKeyDown}
                            />
                          </FormControl>
                          <Box sx={{ textAlign: "right" }}>
                            <Button
                              colorScheme="blue"
                              size="sm"
                              onClick={addNewPlayer}
                              disabled={playerName === ""}
                            >
                              追加
                            </Button>
                          </Box>
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <H3 sx={{ pt: 0 }}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            データベースから追加
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </H3>
                      <AccordionPanel pb={4}>
                        {playerList.length === 0 ? (
                          <Box py={3}>
                            <NextLink href="/player" passHref>
                              <Link>プレイヤー管理</Link>
                            </NextLink>
                            ページから一括でプレイヤー情報を登録できます。
                          </Box>
                        ) : (
                          <CompactPlayerTable
                            game_id={game_id}
                            playerList={playerList}
                            gamePlayers={players}
                          />
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Box
              sx={{
                my: 5,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  backgroundColor:
                    colorMode === "dark"
                      ? theme.colors.black
                      : theme.colors.gray[500],
                }}
              >
                {players.length === 0 ? (
                  <Text>ここに選択したプレイヤーが表示されます。</Text>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                      {(provided) => (
                        <Flex
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          gap={3}
                        >
                          {players.map((gamePlayer, index) => (
                            <Draggable
                              key={gamePlayer.id}
                              draggableId={gamePlayer.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  variant="filled"
                                >
                                  <CardBody>
                                    <Flex sx={{ gap: 3, alignItems: "center" }}>
                                      <Box>
                                        <Text size="xl">{gamePlayer.name}</Text>
                                      </Box>
                                      <IndividualConfig
                                        onClose={onClose}
                                        isOpen={isOpen}
                                        onClick={() => {
                                          setCurrentPlayerIndex(index);
                                          onOpen();
                                        }}
                                        game_id={game_id}
                                        rule_name={rule_name}
                                        players={players}
                                        index={currentPlayerIndex}
                                        correct={[
                                          "normal",
                                          "nomx",
                                          "nomx-ad",
                                          "various-fluctuations",
                                        ].includes(rule_name)}
                                        wrong={["nomx", "nomx-ad"].includes(
                                          rule_name
                                        )}
                                        disabled={disabled}
                                      />
                                    </Flex>
                                  </CardBody>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Flex>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </Box>
              {rule_name === "various-fluctuations" && (
                <Box
                  sx={{
                    p: 3,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor:
                      colorMode === "dark"
                        ? theme.colors.black
                        : theme.colors.gray[500],
                  }}
                >
                  <UnorderedList>
                    <ListItem>
                      各プレイヤーの変動値Nはプレイヤー名横の
                      <Settings
                        style={{
                          display: "inline-block",
                          verticalAlign: "-0.3rem",
                        }}
                      />
                      から設定できます。
                    </ListItem>
                  </UnorderedList>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default SelectPlayer;
