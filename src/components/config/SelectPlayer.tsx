import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

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
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import {
  CirclePlus,
  InfoCircle,
  Plus,
  Settings,
  Upload,
} from "tabler-icons-react";

import CompactPlayerTable from "./CompactPlayerTable";
import IndividualConfig from "./IndividualConfig";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import useDeviceWidth from "#/hooks/useDeviceWidth";
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

  const isDesktop = useDeviceWidth();

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
          base_correct_point: 1,
          base_wrong_point: -1,
        } as GameDBPlayerProps,
      ],
    });
    toast({
      title: "????????????????????????????????????",
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
    // ????????????????????????
    if (!result.destination) {
      return;
    }
    // ?????????????????????????????????
    let movedItems = reorder(
      players, // ?????????????????????????????????
      result.source.index, // ?????????????????????
      result.destination.index // ???????????????????????????
    );
    await db.games.update(game_id, {
      players: movedItems,
    });
  };

  return (
    <>
      <H2>?????????????????????</H2>
      <Box py={5}>
        {playerList.length === 0 ? (
          <>
            <NextLink href={`/player?from=${game_id}`}>
              <Button leftIcon={<Upload />} colorScheme="blue">
                ???????????????????????????????????????
              </Button>
            </NextLink>
          </>
        ) : (
          <>
            <Button
              onClick={() => setDrawerOpen(true)}
              colorScheme="blue"
              disabled={disabled}
              leftIcon={<Plus />}
            >
              ????????????????????????
            </Button>
            <Drawer
              isOpen={drawerOpen}
              placement="right"
              onClose={() => setDrawerOpen(false)}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>?????????????????????</DrawerHeader>
                <DrawerBody p={0}>
                  <Accordion defaultIndex={1}>
                    <AccordionItem>
                      <H3 pt={0}>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            ???????????????
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </H3>
                      <AccordionPanel pb={4}>
                        <Stack spacing={3}>
                          <FormControl>
                            <FormLabel>??????</FormLabel>
                            <Input
                              value={playerName}
                              onChange={(v) => setPlayerName(v.target.value)}
                              placeholder="?????????"
                              ref={nameInputRef}
                              onKeyDown={handleKeyDown}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>
                              ??????????????????
                              <Tooltip
                                hasArrow
                                label="ex. ??????????????????"
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
                            <FormLabel>??????</FormLabel>
                            <Input
                              value={playerBelong}
                              onChange={(v) => setPlayerBelong(v.target.value)}
                              placeholder="????????????"
                              onKeyDown={handleKeyDown}
                            />
                          </FormControl>
                          <Box sx={{ textAlign: "right" }}>
                            <Button
                              colorScheme="blue"
                              size="sm"
                              leftIcon={<CirclePlus />}
                              onClick={addNewPlayer}
                              disabled={playerName === ""}
                            >
                              ??????
                            </Button>
                          </Box>
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <H3 sx={{ pt: 0 }}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            ??????????????????????????????
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </H3>
                      <AccordionPanel pb={4}>
                        {playerList.length === 0 ? (
                          <Box py={3}>
                            <NextLink href="/player" passHref>
                              <Link>?????????????????????</Link>
                            </NextLink>
                            ?????????????????????????????????????????????????????????????????????
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
            {players.length !== 0 && (
              <Box
                sx={{
                  mt: 5,
                  p: 3,
                  backgroundColor:
                    colorMode === "dark"
                      ? theme.colors.gray[600]
                      : theme.colors.gray[300],
                }}
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId="droppable"
                    direction={isDesktop ? "horizontal" : "vertical"}
                  >
                    {(provided) => (
                      <Flex
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{
                          flexDirection: isDesktop ? "row" : "column",
                          gap: 3,
                        }}
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
                                bgColor={
                                  colorMode === "dark"
                                    ? theme.colors.gray[700]
                                    : theme.colors.gray[200]
                                }
                              >
                                <CardBody>
                                  <Flex
                                    sx={{
                                      flexDirection: isDesktop
                                        ? "column"
                                        : "row",
                                      gap: 3,
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      height: "100%",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        writingMode: isDesktop
                                          ? "vertical-rl"
                                          : "horizontal-tb",
                                        whiteSpace: "nowrap",
                                        textOrientation: "upright",
                                      }}
                                    >
                                      <Text size="xl">{gamePlayer.name}</Text>
                                    </Box>
                                    <IndividualConfig
                                      onClick={() => {
                                        setCurrentPlayerIndex(index);
                                        onOpen();
                                      }}
                                      isOpen={isOpen}
                                      onClose={() => {
                                        setCurrentPlayerIndex(0);
                                        onClose();
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
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default SelectPlayer;
