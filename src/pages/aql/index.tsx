import { useEffect, useState } from "react";
import { Link as ReactLink, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";
import { Chalkboard, CirclePlus, Trash, Upload } from "tabler-icons-react";

import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";

export type AQLGamePropsUnion = {
  id: string;
  name: string;
  left_team: string;
  right_team: string;
  quiz: {
    set_name: string;
    offset: number;
  };
  last_open: string;
};

const AQLPage = () => {
  const navigate = useNavigate();
  const [roundName, setRoundName] = useState<string>("AQL");
  const [leftTeamName, setLeftTeamName] = useState<string>("チームA");
  const [rightTeamName, setRightTeamName] = useState<string>("チームB");
  const [quizSet, SetQuizSet] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);

  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizset_names = Array.from(
    new Set(quizes?.map((quiz) => quiz.set_name))
  );

  const aqlGamesRaw = localStorage.getItem("scorewatcher-aql-games");
  const [aqlGames, setAqlGames] = useState<AQLGamePropsUnion[]>(
    aqlGamesRaw
      ? (JSON.parse(aqlGamesRaw) as { games: AQLGamePropsUnion[] }).games
      : []
  );

  const isDesktop = useDeviceWidth();

  useEffect(() => {
    document.title = "AQL設定 | Score Watcher";
  }, []);

  const createAQLGame = () => {
    const game_id = nanoid(6);
    const newAqlGame: AQLGamePropsUnion = {
      id: game_id,
      name: roundName,
      left_team: leftTeamName,
      right_team: rightTeamName,
      quiz: {
        set_name: quizSet,
        offset,
      },
      last_open: cdate().text(),
    };
    let newGameList;
    if (aqlGames) {
      newGameList = [...aqlGames, newAqlGame];
    } else {
      newGameList = [newAqlGame];
    }
    setAqlGames(newGameList);
    localStorage.setItem(
      "scorewatcher-aql-games",
      JSON.stringify({
        games: newGameList,
      })
    );
    navigate(`/aql/${game_id}`);
  };

  useEffect(() => {
    window.localStorage.setItem(
      "scorewatcher-aql-games",
      JSON.stringify({
        games: aqlGames,
      })
    );
  }, [aqlGames]);

  return (
    <Container pt={5}>
      <Box pt={5}>
        <h2>AQLルール</h2>
        {aqlGames && aqlGames.length !== 0 && (
          <Box pt={5}>
            <h3>作成したゲーム</h3>
            <TableContainer pt={2}>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>ラウンド名</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {aqlGames.map((game, i) => {
                    return (
                      <Tr key={game.id}>
                        <Td>{game.name}</Td>
                        <Td isNumeric>
                          <Button
                            as={ReactLink}
                            colorScheme="green"
                            leftIcon={<Chalkboard />}
                            size="sm"
                            to={`/aql/${game.id}`}
                            variant="ghost"
                          >
                            開く
                          </Button>
                          <Button
                            colorScheme="red"
                            leftIcon={<Trash />}
                            onClick={() =>
                              setAqlGames(aqlGames.filter((game, n) => i !== n))
                            }
                            size="sm"
                            variant="ghost"
                          >
                            削除
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <Box pt={5}>
          <h3>新規作成</h3>
          <Flex direction={isDesktop ? "row" : "column"} gap={3}>
            <FormControl pt={2}>
              <FormLabel>ラウンド名</FormLabel>
              <Input
                onChange={(v) => setRoundName(v.target.value)}
                type="text"
                value={roundName}
              />
            </FormControl>
            <FormControl pt={2}>
              <FormLabel>左側のチーム名</FormLabel>
              <Input
                onChange={(v) => setLeftTeamName(v.target.value)}
                type="text"
                value={leftTeamName}
              />
            </FormControl>
            <FormControl pt={2}>
              <FormLabel>右側のチーム名</FormLabel>
              <Input
                onChange={(v) => setRightTeamName(v.target.value)}
                type="text"
                value={rightTeamName}
              />
            </FormControl>
          </Flex>
        </Box>
        <Box pt={5}>
          {quizset_names.length !== 0 ? (
            <Flex sx={{ gap: 5 }}>
              <FormControl pt={5} width={200}>
                <FormLabel>セット名</FormLabel>
                <Select
                  defaultValue={quizSet}
                  onChange={(v) => SetQuizSet(v.target.value)}
                >
                  <option value="">問題を表示しない</option>
                  {quizset_names.map((setname) => (
                    <option key={setname} value={setname}>
                      {setname}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {quizSet !== "" && (
                <FormControl pt={5} width={200}>
                  <FormLabel>オフセット</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(s, n) => setOffset(n)}
                    value={offset}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              )}
            </Flex>
          ) : (
            <Box>
              <Button
                as={ReactLink}
                colorScheme="blue"
                disabled={
                  roundName === "" ||
                  leftTeamName === "" ||
                  rightTeamName === ""
                }
                leftIcon={<Upload />}
                to="/quiz"
              >
                問題データを読み込む
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ textAlign: "right", pt: 5 }}>
          <Button
            colorScheme="green"
            leftIcon={<CirclePlus />}
            onClick={createAQLGame}
          >
            作る
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AQLPage;
