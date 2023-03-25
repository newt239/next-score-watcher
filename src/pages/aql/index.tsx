import { Link as ReactLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
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
  Box,
  Container,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";
import { Chalkboard, CirclePlus, Trash, Upload } from "tabler-icons-react";

import useDeviceWidth from "#/hooks/useDeviceWidth";

import db from "#/utils/db";

export type AQLGameProps = {
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
  const [roundName, setRoundName] = useState<string>("");
  const [leftTeamName, setLeftTeamName] = useState<string>("");
  const [rightTeamName, setRightTeamName] = useState<string>("");
  const [quizSet, SetQuizSet] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);

  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizset_names = Array.from(
    new Set(quizes?.map((quiz) => quiz.set_name))
  );

  const aqlGamesRaw = localStorage.getItem("scorewatcher-aql-games");
  const [aqlGames, setAqlGames] = useState<AQLGameProps[]>(
    aqlGamesRaw
      ? (JSON.parse(aqlGamesRaw) as { games: AQLGameProps[] }).games
      : []
  );

  const isDesktop = useDeviceWidth();

  const createAQLGame = () => {
    const game_id = nanoid(6);
    const newAqlGame: AQLGameProps = {
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
    if (aqlGames) {
      setAqlGames([...aqlGames, newAqlGame]);
    } else {
      setAqlGames([newAqlGame]);
    }
    navigate(`/aql/${game_id}`);
  };

  useEffect(() => {
    localStorage.setItem(
      "scorewatcher-aql-games",
      JSON.stringify({
        games: aqlGames,
      })
    );
  }, [aqlGames]);
  return (
    <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
      <h2>AQLルール</h2>
      {aqlGames && aqlGames.length !== 0 && (
        <>
          <h3>作成したゲーム</h3>
          <TableContainer pt={5}>
            <Table variant="simple" size="sm">
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
                        <ReactLink to={`/aql/${game.id}`}>
                          <Button
                            size="sm"
                            colorScheme="green"
                            variant="ghost"
                            leftIcon={<Chalkboard />}
                          >
                            開く
                          </Button>
                        </ReactLink>
                        <Button
                          leftIcon={<Trash />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() =>
                            setAqlGames(aqlGames.filter((game, n) => i !== n))
                          }
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
        </>
      )}
      <h3>新規作成</h3>
      <Flex gap={3} direction={isDesktop ? "row" : "column"}>
        <FormControl pt={5}>
          <FormLabel>ラウンド名</FormLabel>
          <Input
            type="text"
            value={roundName}
            onChange={(v) => setRoundName(v.target.value)}
          />
        </FormControl>
        <FormControl pt={5}>
          <FormLabel>左側のチーム名</FormLabel>
          <Input
            type="text"
            value={leftTeamName}
            onChange={(v) => setLeftTeamName(v.target.value)}
          />
        </FormControl>
        <FormControl pt={5}>
          <FormLabel>右側のチーム名</FormLabel>
          <Input
            type="text"
            value={rightTeamName}
            onChange={(v) => setRightTeamName(v.target.value)}
          />
        </FormControl>
      </Flex>
      <Box py={5}>
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
                  value={offset}
                  min={0}
                  onChange={(s, n) => setOffset(n)}
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
            <ReactLink to="/quiz">
              <Button
                disabled={
                  roundName === "" ||
                  leftTeamName === "" ||
                  rightTeamName === ""
                }
                colorScheme="blue"
                leftIcon={<Upload />}
              >
                問題データを読み込む
              </Button>
            </ReactLink>
          </Box>
        )}
      </Box>
      <Box sx={{ textAlign: "right", pt: 5 }}>
        <Button
          leftIcon={<CirclePlus />}
          colorScheme="green"
          onClick={createAQLGame}
        >
          作る
        </Button>
      </Box>
    </Container>
  );
};

export default AQLPage;
