import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import ButtonLink from "~/components/ButtonLink";
import InputLayout from "~/components/InputLayout";
import AlertDialog from "~/features/components/AlertDialog";
import ConfigInput from "~/features/config/ConfigInput";
import CopyGame from "~/features/config/CopyGame";
import ExportGame from "~/features/config/ExportGame";
import PlayersConfig from "~/features/config/PlayersConfig";
import RuleSettings from "~/features/config/RuleSettings";
import SelectQuizset from "~/features/config/SelectQuizSet";
import useDeviceWidth from "~/hooks/useDeviceWidth";
import db from "~/utils/db";
import { recordEvent } from "~/utils/ga4";
import { rules } from "~/utils/rules";

const ConfigPage = () => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const navigate = useNavigate();
  const isDesktop = useDeviceWidth();
  const { game_id } = useParams();
  const toast = useToast();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );
  const players = useLiveQuery(
    () => db(currentProfile).players.orderBy("name").toArray(),
    []
  );
  const logs = useLiveQuery(
    () =>
      db(currentProfile)
        .logs.where({ game_id: game_id as string })
        .toArray(),
    []
  );
  const quizes = useLiveQuery(() => db(currentProfile).quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));
  const [tabIndex, setTabIndex] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setTabIndex(0);
    db(currentProfile).games.update(game_id as string, {
      last_open: cdate().text(),
    });
    document.title = "ゲーム設定 | Score Watcher";
  }, []);

  if (!game || !players || !logs) return null;

  const deleteGame = async () => {
    await db(currentProfile).games.delete(game.id);
    toast({
      title: "ゲームを削除しました",
      description: `${game.name}(${rules[game.rule].name})を削除しました`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    recordEvent({
      action: "delete_game",
      category: "engagement",
      label: game.rule,
    });
    navigate("/");
  };

  const disabled = logs.length !== 0;

  const errorMessages = [];
  if (game.players.length === 0)
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  if (game.players.length > 14)
    errorMessages.push("プレイヤー人数は14人以内で設定してください。");
  if (game.win_through && game.players.length <= game.win_through)
    errorMessages.push(
      "「勝ち抜け人数」はプレイヤーの人数より少なくしてください。"
    );
  if (disabled)
    errorMessages.push(
      `現在${
        logs.length + 1
      }問目です。ゲームが開始済みであるため、一部の設定は変更できません。`
    );

  const playButtonIsDisabled =
    errorMessages.filter((t) => t.indexOf("ゲームが開始済み") === -1).length !==
    0;

  return (
    <Box>
      <h3>{rules[game.rule].name}</h3>
      <Accordion allowMultiple defaultIndex={[]}>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {rules[game.rule].short_description}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {rules[game.rule]?.description}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Box
        sx={{
          my: 5,
          borderStyle: "solid",
          borderRadius: "md",
          borderWidth: 1,
          borderColor: playButtonIsDisabled
            ? "red.500!important"
            : "white!important",
          _dark: {
            borderColor: playButtonIsDisabled
              ? "red.300!important"
              : "gray.800!important",
          },
        }}
      >
        <InputLayout
          label={
            <UnorderedList
              sx={{
                color: "red.500",
                _dark: {
                  color: "red.300",
                },
              }}
            >
              {errorMessages.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </UnorderedList>
          }
          simple
          vertical={!isDesktop}
        >
          {playButtonIsDisabled ? (
            <Button
              colorScheme="green"
              isDisabled={playButtonIsDisabled}
              leftIcon={<PlayerPlay />}
              size="lg"
            >
              ゲーム開始
            </Button>
          ) : (
            <ButtonLink
              size="lg"
              colorScheme="green"
              href={`/games/${game_id}/board`}
              leftIcon={<PlayerPlay />}
            >
              ゲーム開始
            </ButtonLink>
          )}
        </InputLayout>
      </Box>
      <Box>
        <Tabs
          colorScheme="green"
          isFitted
          variant="enclosed"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <TabList>
            <Tab>形式設定</Tab>
            <Tab>プレイヤー設定</Tab>
            <Tab>その他の設定</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <h2>形式設定</h2>
              <RuleSettings disabled={disabled} game={game} />
            </TabPanel>
            <TabPanel>
              <PlayersConfig
                disabled={disabled}
                game_id={game.id}
                playerList={players}
                players={game.players}
                rule_name={game.rule}
              />
            </TabPanel>
            <TabPanel>
              <h2>その他の設定</h2>
              <SelectQuizset
                game_id={game.id}
                game_quiz={game.quiz}
                quizset_names={quizsetList}
              />
              <h3>オプション</h3>
              <ConfigInput
                label="Discord Webhook"
                input_id="discord_webhook_url"
                placeholder="https://discord.com/api/webhooks/..."
                type="url"
              />
              <h3>ゲーム</h3>
              <InputLayout label="ゲームのコピーを作成">
                <CopyGame game={game} />
              </InputLayout>
              <InputLayout label="エクスポート">
                <ExportGame game={game} />
              </InputLayout>
              <InputLayout label="ゲームを削除">
                <Button colorScheme="red" leftIcon={<Trash />} onClick={onOpen}>
                  削除する
                </Button>
              </InputLayout>
              <AlertDialog
                body="ゲームを削除します。この操作は取り消せません。"
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={() => {
                  deleteGame();
                  onClose();
                }}
                title="ゲームを削除"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default ConfigPage;
