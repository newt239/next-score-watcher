import { useRouter } from "next/router";

import { Box, Button, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { Upload } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import db from "#/utils/db";

type SelectQuizsetProps = {
  game_id: string;
  default_quizset: string;
  quizset_names: string[];
};

const SelectQuizset: React.FC<SelectQuizsetProps> = ({
  game_id,
  default_quizset,
  quizset_names,
}) => {
  const router = useRouter();
  return (
    <>
      <H2>問題設定</H2>
      <Box pt={5}>
        {quizset_names.length !== 0 ? (
          <FormControl pt={5} width={200}>
            <FormLabel>セット名</FormLabel>
            <Select
              defaultValue={default_quizset}
              onChange={async (v) => {
                await db.games.update(game_id as string, {
                  quiz_set: v.target.value,
                });
              }}
            >
              <option value="">問題を表示しない</option>
              {quizset_names.map((setname) => (
                <option key={setname} value={setname}>
                  {setname}
                </option>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Box>
            <Button
              onClick={() =>
                router.push({
                  pathname: "/quiz",
                  query: { from: game_id },
                })
              }
              colorScheme="green"
              leftIcon={<Upload />}
            >
              問題データを読み込み
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SelectQuizset;
