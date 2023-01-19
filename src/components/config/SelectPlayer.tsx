import NextLink from "next/link";
import { useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  ListItem,
  Text,
  UnorderedList,
  FormControl,
  Input,
  FormLabel,
  Stack,
  InputGroup,
  InputLeftElement,
  Link,
  useToast,
  Flex,
  TagLabel,
  TagRightIcon,
  Tag,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { Filter, InfoCircle, Plus, X } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import db, { GameDBPlayerProps, PlayerDBProps } from "#/utils/db";
interface SelectPlayerProps {
  game_id: string;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
}

const SelectPlayer: React.FC<SelectPlayerProps> = ({
  game_id,
  playerList,
  players,
  disabled,
}) => {
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerText, setPlayerText] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const onChangeHandler = async (player: PlayerDBProps) => {
    if (players.map((gamePlayer) => gamePlayer.id).includes(player.id)) {
      await db.games.update(game_id, {
        players: players.filter(({ id }) => id != player.id),
      });
    } else {
      await db.games.update(game_id, {
        players: [...players, Number(player.id)],
      });
    }
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
      players: [...players, { id: player_id }],
    });
    toast({
      title: "プレイヤーを作成しました",
      description: `${playerName}${
        playerBelong !== "" ? " / " + playerBelong : ""
      }`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setPlayerName("");
    setPlayerBelong("");
  };

  return (
    <>
      <H2>プレイヤー設定</H2>
      <Box pt={5}>
        <Button
          onClick={() => setDrawerOpen(true)}
          colorScheme="green"
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
              <Accordion defaultIndex={[1]} allowMultiple>
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
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>所属</FormLabel>
                        <Input
                          value={playerBelong}
                          onChange={(v) => setPlayerBelong(v.target.value)}
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
                      <>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Filter />
                          </InputLeftElement>
                          <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="氏名・所属・タグで検索"
                          />
                        </InputGroup>
                        <Box pt={3}>
                          {playerList
                            .filter(
                              (player) =>
                                player.name.includes(searchText) ||
                                player.belong.includes(searchText) ||
                                player.tags.includes(searchText)
                            )
                            .map((player, i) => (
                              <Flex key={i}>
                                <Checkbox
                                  onChange={() => onChangeHandler(player)}
                                  isChecked={players
                                    .map((gamePlayer) => gamePlayer.id)
                                    .includes(player.id)}
                                />
                                <span>{player.name}</span>
                                {player.belong !== "" && (
                                  <span>, {player.belong}</span>
                                )}
                                {player.tags.length !== 0 && (
                                  <span>
                                    ,
                                    {player.tags.map((tag, i) => (
                                      <Tag key={i} colorScheme="green">
                                        <TagLabel>{tag}</TagLabel>
                                        <TagRightIcon
                                          sx={{ cursor: "pointer" }}
                                          onClick={async () => {
                                            await db.players.update(game_id, {
                                              tags: player.tags.filter(
                                                (playerTag) => playerTag !== tag
                                              ),
                                            });
                                          }}
                                        >
                                          <X />
                                        </TagRightIcon>
                                      </Tag>
                                    ))}
                                  </span>
                                )}
                              </Flex>
                            ))}
                        </Box>
                      </>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Box pt={5}>
          {players.length === 0 ? (
            <Text>ここに選択したプレイヤーが表示されます。</Text>
          ) : (
            <UnorderedList>
              {players.map((gamePlayer) => (
                <ListItem key={gamePlayer.id}>
                  {
                    playerList.find((player) => player.id === gamePlayer.id)
                      ?.name
                  }
                </ListItem>
              ))}
            </UnorderedList>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SelectPlayer;
