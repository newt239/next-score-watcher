import { useEffect, useRef, useState } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Spacer,
  Stack,
  Text,
  theme,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { ReactSortable } from "react-sortablejs";
import { CirclePlus, Plus, Upload } from "tabler-icons-react";

import CompactPlayerTable from "#/components/config/CompactPlayerTable";
import IndividualConfig from "#/components/config/IndividualConfig";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { GameDBPlayerProps, PlayerDBProps, RuleNames } from "#/utils/types";

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
    if (sortableList.length !== players.length) {
      setSortableList(players);
    }
  }, [players]);

  useEffect(() => {
    if (sortableList.length === players.length) {
      db.games.update(game_id, {
        players: sortableList,
      });
    } else {
      setSortableList(players);
    }
  }, [sortableList]);

  return (
    <Box>
      <h2>プレイヤー設定</h2>
      <Spacer h={2} />
      {playerList.length === 0 ? (
        <Button
          as={ReactLink}
          colorScheme="blue"
          leftIcon={<Upload />}
          to={`/player?from=${game_id}`}
        >
          プレイヤーデータを読み込む
        </Button>
      ) : (
        <>
          <Button
            colorScheme="blue"
            disabled={disabled}
            leftIcon={<Plus />}
            onClick={() => setDrawerOpen(true)}
          >
            プレイヤーを選択
          </Button>
          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="right"
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
                            onChange={(v) => setPlayerName(v.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="越山識"
                            ref={nameInputRef}
                            value={playerName}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>順位</FormLabel>
                          <Input
                            onChange={(v) => setPlayerText(v.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="24th"
                            value={playerText}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>所属</FormLabel>
                          <Input
                            onChange={(v) => setPlayerBelong(v.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="文蔵高校"
                            value={playerBelong}
                          />
                        </FormControl>
                        <Box sx={{ textAlign: "right" }}>
                          <Button
                            colorScheme="blue"
                            disabled={playerName === ""}
                            leftIcon={<CirclePlus />}
                            onClick={addNewPlayer}
                            size="sm"
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
                          <Link as={ReactLink} color="blue.500" to="/player">
                            プレイヤー管理
                          </Link>
                          ページから一括でプレイヤー情報を登録できます。
                        </Box>
                      ) : (
                        <CompactPlayerTable
                          gamePlayers={players}
                          game_id={game_id}
                          playerList={playerList}
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
                animation={200}
                delay={2}
                direction={isDesktop ? "vertical" : "horizontal"}
                list={sortableList}
                setList={(newState) => setSortableList(newState)}
                style={{
                  display: "flex",
                  flexDirection: isDesktop ? "row" : "column",
                  gap: 5,
                }}
              >
                {sortableList.map((player, index) => (
                  <Card
                    bgColor={
                      colorMode === "dark"
                        ? theme.colors.gray[700]
                        : theme.colors.gray[200]
                    }
                    cursor="grab"
                    key={player.id}
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
                          correct={[
                            "normal",
                            "nomx",
                            "nomx-ad",
                            "variables",
                          ].includes(rule_name)}
                          disabled={disabled}
                          game_id={game_id}
                          index={currentPlayerIndex}
                          isOpen={isOpen}
                          onClick={() => {
                            setCurrentPlayerIndex(index);
                            onOpen();
                          }}
                          onClose={() => {
                            setCurrentPlayerIndex(0);
                            onClose();
                          }}
                          players={players}
                          rule_name={rule_name}
                          wrong={["nomx", "nomx-ad"].includes(rule_name)}
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
  );
};

export default SelectPlayer;
