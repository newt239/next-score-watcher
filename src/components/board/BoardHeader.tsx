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
  theme,
  useColorMode,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";
import {
  AdjustmentsHorizontal,
  ArrowBackUp,
  Comet,
  HandClick,
  Home,
  Settings,
} from "tabler-icons-react";

import H2 from "#/blocks/H2";
import db, { GameDBProps, LogDBProps, QuizDBProps } from "#/utils/db";
import { GetRuleStringByType } from "#/utils/rules";

type BoardHeaderProps = {
  game: GameDBProps;
  logs: LogDBProps[];
};

const BoardHeader: React.FC<BoardHeaderProps> = ({ game, logs }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [quizList, setQuizList] = useState<QuizDBProps[]>([]);

  useEffect(() => {
    const getQuizList = async () => {
      if (game.quiz_set) {
        const a = await db.quizes.toArray();
        console.log(a);
        setQuizList(
          await db.quizes.where({ set_name: game.quiz_set }).sortBy("n")
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
        height: "15vh",
        px: 5,
        borderStyle: "solid",
        borderWidth: "0px 0px thin",
        borderColor:
          colorMode === "light"
            ? "rgb(231, 235, 240)"
            : "rgba(194, 224, 255, 0.08)",
        backgroundColor:
          colorMode === "light"
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(10, 25, 41, 0.7)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderStyle: "solid",
          borderWidth: "thin",
          borderColor:
            colorMode === "light"
              ? "rgb(231, 235, 240)"
              : "rgba(194, 224, 255, 0.08)",
          borderRadius: "1rem",
          padding: 3,
        }}
      >
        <H2 sx={{ pt: 0 }}>{game.name}</H2>
        <p>{GetRuleStringByType(game)}</p>
      </Box>
      <Box sx={{ whiteSpace: "nowrap" }}>
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
              <div style={{ maxHeight: "8vh", overflow: "hidden" }}>
                {quizList[logs.length - 1].q}
              </div>
              <div style={{ textAlign: "right", color: theme.colors.red[500] }}>
                {quizList[logs.length - 1].a}
              </div>
            </div>
          )}
      </Box>
      <Box>
        <Menu closeOnSelect={false}>
          <MenuButton as={IconButton} icon={<Settings />} variant="outline" />
          <MenuList>
            <MenuItem
              icon={<Comet />}
              onClick={async () => {
                try {
                  await db.logs.put({
                    id: nanoid(),
                    game_id: game.id,
                    player_id: "-",
                    variant: "through",
                    system: false,
                    timestamp: cdate().text(),
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
                  await db.logs.delete(logs[logs.length - 1].id);
                }
              }}
            >
              一つ戻す
            </MenuItem>
            <MenuItem
              icon={<HandClick />}
              onClick={async () =>
                await db.games.update(game.id, {
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
            <MenuItem icon={<Home />} onClick={() => router.push(`/`)}>
              ホームに戻る
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default BoardHeader;
