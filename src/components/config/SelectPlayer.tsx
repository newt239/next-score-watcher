import { Link as ReactLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

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
import { CirclePlus, InfoCircle, Plus, Upload } from "tabler-icons-react";
import { ReactSortable } from "react-sortablejs";

import CompactPlayerTable from "#/components/config/CompactPlayerTable";
import IndividualConfig from "#/components/config/IndividualConfig";

import useDeviceWidth from "#/hooks/useDeviceWidth";
import db, { GameDBPlayerProps, PlayerDBProps, RuleNames } from "#/utils/db";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerText, setPlayerText] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [sortableList, setSortableList] = useState(players);

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

  useEffect(() => {
    db.games.update(game_id, {
      players: sortableList,
    });
  }, [sortableList]);

  return (
    <>
      <h2>プレイヤー設定</h2>
      <Box py={5}>
        {playerList.length === 0 ? (
          <>
            <ReactLink to={`/player?from=${game_id}`}>
              <Button leftIcon={<Upload />} colorScheme="blue">
                プレイヤーデータを読み込む
              </Button>
            </ReactLink>
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
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          新しく追加
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
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
                              leftIcon={<CirclePlus />}
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
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          データベースから追加
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        {playerList.length === 0 ? (
                          <Box py={3}>
                            <Link as={ReactLink} to="/player" color="blue.500">
                              プレイヤー管理
                            </Link>
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
                <ReactSortable
                  list={sortableList}
                  setList={(newState) => setSortableList(newState)}
                  animation={200}
                  delay={2}
                  direction="horizontal"
                  style={{ display: "flex", gap: 5 }}
                >
                  {sortableList.map((player, index) => (
                    <Card
                      key={player.id}
                      bgColor={
                        colorMode === "dark"
                          ? theme.colors.gray[700]
                          : theme.colors.gray[200]
                      }
                      cursor="grab"
                    >
                      <CardBody>
                        <Flex
                          sx={{
                            flexDirection: isDesktop ? "column" : "row",
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
                            <Text size="xl">{player.name}</Text>
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
                            wrong={["nomx", "nomx-ad"].includes(rule_name)}
                            disabled={disabled}
                          />
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </ReactSortable>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default SelectPlayer;
