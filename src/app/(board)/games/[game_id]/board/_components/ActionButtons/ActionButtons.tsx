"use client";

import { Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { sendGAEvent } from "@next/third-parties/google";
import { cdate } from "cdate";
import { nanoid } from "nanoid";
import {
  AdjustmentsHorizontal,
  ArrowBackUp,
  Ballon,
  Comet,
  Maximize,
  Square,
  SquareCheck,
} from "tabler-icons-react";

import PreferenceDrawer from "../PreferenceDrawer";

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
      <Group justify="flex-end" p="sm" gap="sm">
        <Button
          size="sm"
          variant="default"
          leftSection={<Comet size={20} />}
          disabled={game.editable}
          onClick={async () => {
            try {
              await db(currentProfile).logs.put({
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
        </Button>
        <Button
          size="sm"
          variant="default"
          leftSection={<ArrowBackUp size={20} />}
          disabled={logs.length === 0 || game.editable}
          onClick={async () => {
            if (logs.length !== 0) {
              sendGAEvent({
                event: "undo_log",
                value: game.rule,
              });
              await db(currentProfile).logs.delete(logs[logs.length - 1].id);
            }
          }}
        >
          一つ戻す
        </Button>
        {game.rule !== "aql" && (
          <Button
            size="sm"
            variant="default"
            leftSection={
              game.editable ? <SquareCheck size={20} /> : <Square size={20} />
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
            size="sm"
            variant="default"
            leftSection={<Maximize size={20} />}
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
          size="sm"
          variant="default"
          leftSection={<Ballon size={20} />}
          onClick={open}
        >
          表示設定
        </Button>
        <ButtonLink
          size="sm"
          variant="default"
          leftSection={<AdjustmentsHorizontal size={20} />}
          href={`/games/${game.id}/config`}
        >
          ゲーム設定
        </ButtonLink>
      </Group>
      <PreferenceDrawer isOpen={opened} onClose={close} />
    </>
  );
};

export default ActionButtons;
