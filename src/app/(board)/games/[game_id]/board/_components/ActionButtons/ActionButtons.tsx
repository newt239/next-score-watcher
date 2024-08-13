"use client";

import { Button, Group, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { sendGAEvent } from "@next/third-parties/google";
import {
  IconAdjustmentsHorizontal,
  IconArrowBackUp,
  IconBalloon,
  IconComet,
  IconMaximize,
  IconSquare,
  IconSquareCheck,
} from "@tabler/icons-react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import PreferenceDrawer from "../PreferenceDrawer";

import classes from "./ActionButtons.module.css";

import ButtonLink from "@/app/_components/ButtonLink";
import db from "@/utils/db";
import { GamePropsUnion, LogDBProps } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  logs: LogDBProps[];
  currentProfile: string;
};

const ActionButtons: React.FC<Props> = ({ game, logs, currentProfile }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ScrollArea w="100%">
        <Group
          justify="flex-end"
          p="xs"
          gap="xs"
          className={classes.action_button_list}
        >
          <Button
            size="xs"
            variant="default"
            leftSection={<IconComet size={20} />}
            disabled={game.editable}
            onClick={async () => {
              try {
                await db(currentProfile).logs.put({
                  id: nanoid(),
                  game_id: game.id,
                  player_id: "-",
                  variant: "through",
                  system: 0,
                  timestamp: cdate().text(),
                  available: 1,
                });
              } catch (e) {
                console.log(e);
              }
            }}
          >
            スルー
          </Button>
          <Button
            size="xs"
            variant="default"
            leftSection={<IconArrowBackUp size={20} />}
            disabled={logs.length === 0 || game.editable}
            onClick={async () => {
              if (logs.length !== 0) {
                sendGAEvent({
                  event: "undo_log",
                  value: game.rule,
                });
                await db(currentProfile).logs.update(logs[logs.length - 1].id, {
                  available: 0,
                });
              }
            }}
          >
            一つ戻す
          </Button>
          {game.rule !== "aql" && (
            <Button
              visibleFrom="md"
              size="xs"
              variant="default"
              leftSection={
                game.editable ? (
                  <IconSquareCheck size={20} />
                ) : (
                  <IconSquare size={20} />
                )
              }
              onClick={async () => {
                try {
                  await db(currentProfile).games.put({
                    ...game,
                    editable: !game.editable,
                  });
                  sendGAEvent({
                    event: "switch_editable",
                    value: game.rule,
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              スコアの手動更新
            </Button>
          )}
          {document.fullscreenEnabled && (
            <Button
              visibleFrom="md"
              size="xs"
              variant="default"
              leftSection={<IconMaximize size={20} />}
              onClick={() => {
                sendGAEvent({
                  event: "switch_fullscreen",
                  value: game.rule,
                });
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              フルスクリーン
            </Button>
          )}
          <Button
            size="xs"
            variant="default"
            leftSection={<IconBalloon size={20} />}
            onClick={open}
          >
            表示設定
          </Button>
          <ButtonLink
            size="xs"
            variant="default"
            leftSection={<IconAdjustmentsHorizontal size={20} />}
            href={`/games/${game.id}/config`}
          >
            ゲーム設定
          </ButtonLink>
        </Group>
      </ScrollArea>
      <PreferenceDrawer isOpen={opened} onClose={close} />
    </>
  );
};

export default ActionButtons;
