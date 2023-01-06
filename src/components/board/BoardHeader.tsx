import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  AdjustmentsHorizontal,
  ArrowBackUp,
  Comet,
  HandClick,
  Settings,
} from "tabler-icons-react";

import H2 from "#/blocks/H2";
import db, { QuizDBProps } from "#/utils/db";
import { rules } from "#/utils/rules";

const BoardHeader: React.FC = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  useEffect(() => {
    const getQuizList = async () => {
      if (game?.quiz_set) {
        setQuizList(
          await db.quizes.where({ set_name: game.quiz_set }).toArray()
        );
      }
    };
    getQuizList();
  }, [game]);

  if (!game || !logs) {
    return null;
  }

  return (
    <Flex
      sx={{
        alignItems: "center",
        gap: 5,
        height: "10vh",
        px: 5,
        borderBottom: "1px solid black",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <H2 sx={{ pt: 0 }}>{game.name}</H2>
        <p>{rules[game.rule].name}</p>
      </Box>
      <Box>
        第
        <span style={{ fontSize: "2rem", fontWeight: 800 }}>
          {logs.length + 1}
        </span>
        問
      </Box>
      <Box
        style={{
          flexGrow: 1,
          padding: "1rem",
          height: "100%",
        }}
      >
        {game.quiz_set &&
          quizList.length >= logs.length &&
          logs.length !== 0 && (
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden",
              }}
            >
              <div>{quizList[logs.length - 1].q}</div>
              <div style={{ textAlign: "right", color: "red" }}>
                {quizList[logs.length - 1].a}
              </div>
            </div>
          )}
      </Box>
      <Box>
        <Menu closeOnSelect={false}>
          <MenuButton as={IconButton} icon={<Settings />} />
          <MenuList>
            <MenuItem
              icon={<Comet />}
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: Number(game_id),
                    player_id: -1,
                    variant: "through",
                    system: false,
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
              disabled={logs.length === 0}
              onClick={async () => {
                if (logs.length !== 0) {
                  await db.logs.delete(Number(logs[logs.length - 1].id));
                }
              }}
            >
              一つ戻す
            </MenuItem>
            <MenuItem
              icon={<HandClick />}
              onClick={async () =>
                await db.games.update(Number(game.id), {
                  editable: !game.editable,
                })
              }
            >
              <FormControl
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormLabel mb="0">スコアの手動更新</FormLabel>
                <Switch isChecked={game.editable} />
              </FormControl>
            </MenuItem>
            <MenuItem
              icon={<AdjustmentsHorizontal />}
              onClick={() => router.push(`/${game.id}/config`)}
            >
              設定
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default BoardHeader;
