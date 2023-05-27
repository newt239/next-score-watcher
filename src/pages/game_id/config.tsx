import { useEffect } from "react";
import { Link as ReactLink, useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import ConfigInput from "#/components/config/ConfigInput";
import ConfigNumberInput from "#/components/config/ConfigNumberInput";
import SelectPlayer from "#/components/config/SelectPlayer";
import SelectQuizset from "#/components/config/SelectQuizSet";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { rules } from "#/utils/rules";

const ConfigPage = () => {
  const navigate = useNavigate();
  const isDesktop = useDeviceWidth(400);
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const players = useLiveQuery(() => db.players.orderBy("name").toArray(), []);
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: game_id as string }).toArray(),
    []
  );
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));

  useEffect(() => {
    db.games.update(game_id as string, { last_open: cdate().text() });
    document.title = "ゲーム設定 | Score Watcher";
  }, []);

  if (!game || !players || !logs) return null;

  const deleteGame = async () => {
    await db.games.delete(game.id);
    navigate("/");
  };

  const disabled = logs.length !== 0;

  return (
    <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
      {disabled && (
        <Alert status="error">
          ゲームは開始済みです。一部の設定は変更できません。
        </Alert>
      )}
      <Alert status="info">
        <Box>
          <AlertTitle>{rules[game.rule].name}</AlertTitle>
          <AlertDescription>
            {rules[game.rule].description.split("\n").map((p) => (
              <p key={p}>{p}</p>
            ))}
          </AlertDescription>
        </Box>
      </Alert>
      <Box>
        <h2>形式設定</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <ConfigInput
            input_id="name"
            label="ゲーム名"
            placehodler="〇〇大会"
          />
          {["nomx", "nomx-ad", "nomr"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="win_point"
              label="勝ち抜け正解数"
              max={1000}
              disabled={disabled}
            />
          )}
          {["ny", "various-fluctuations"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="win_point"
              label="勝ち抜けポイント"
              max={1000}
              min={3}
              disabled={disabled}
            />
          )}
          {["nbyn", "nupdown"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="win_point"
              label="N"
              max={10}
              disabled={disabled}
            />
          )}
          {["squarex", "freezex"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="win_point"
              label="X"
              max={100}
              disabled={disabled}
            />
          )}
          {["nomx", "nomx-ad", "nbyn", "nupdown"].includes(game.rule) && (
            <ConfigNumberInput
              input_id="lose_point"
              label="失格誤答数"
              max={100}
              disabled={disabled}
            />
          )}
          {["attacksurvival"].includes(game.rule) && (
            <>
              <ConfigNumberInput
                input_id="win_point"
                label="初期値"
                max={30}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="win_through"
                label="勝ち抜け人数"
                max={game.players.length}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="correct_me"
                label="自分が正答"
                min={-10}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="wrong_me"
                label="自分が誤答"
                min={-10}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="correct_other"
                label="他人が正答"
                min={-10}
                disabled={disabled}
              />
              <ConfigNumberInput
                input_id="wrong_other"
                label="他人が誤答"
                min={-10}
                disabled={disabled}
              />
            </>
          )}
        </div>
        <SelectPlayer
          game_id={game.id}
          rule_name={game.rule}
          playerList={players}
          players={game.players}
          disabled={disabled}
        />
        <SelectQuizset
          game_id={game.id}
          game_quiz={game.quiz}
          quizset_names={quizsetList}
        />
        <Flex
          sx={{
            flexDirection: isDesktop ? "row" : "column-reverse",
            justifyContent: "space-between",
            pt: 20,
            gap: 5,
          }}
        >
          <Button leftIcon={<Trash />} colorScheme="red" onClick={deleteGame}>
            ゲームを削除
          </Button>
          {game.players.length === 0 ? (
            <Button colorScheme="green" leftIcon={<PlayerPlay />} disabled>
              ゲーム開始
            </Button>
          ) : (
            <ReactLink to={`/${game_id}/board`}>
              <Button colorScheme="green" leftIcon={<PlayerPlay />}>
                ゲーム開始
              </Button>
            </ReactLink>
          )}
        </Flex>
      </Box>
    </Container>
  );
};

export default ConfigPage;
