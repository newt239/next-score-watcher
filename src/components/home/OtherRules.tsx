import NextLink from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";

import {
  Box,
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

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
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

const RuleList: React.FC = () => {
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
    router.push(`/aql/${game_id}`);
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
    <Box pt={5}>
      <H2>その他の形式</H2>
      <H3>AQLルール</H3>
      {aqlGames && aqlGames.length !== 0 && (
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
                      <NextLink href={`/aql/${game.id}`}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          variant="ghost"
                          leftIcon={<Chalkboard />}
                        >
                          開く
                        </Button>
                      </NextLink>
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
      )}
      <Flex gap={3}>
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
            <NextLink href="/quiz">
              <Button colorScheme="blue" leftIcon={<Upload />}>
                問題データを読み込む
              </Button>
            </NextLink>
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
    </Box>
  );
};

export default RuleList;
