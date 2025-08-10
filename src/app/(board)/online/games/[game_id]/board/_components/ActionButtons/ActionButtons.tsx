"use client";

import { Button, Group, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconArrowBackUp,
  IconBalloon,
  IconComet,
  IconMaximize,
} from "@tabler/icons-react";

import PreferenceDrawer from "../PreferenceDrawer";

import classes from "./ActionButtons.module.css";

import type { UserPreferencesType } from "@/models/user-preferences";
import type { RuleNames } from "@/utils/types";

import ButtonLink from "@/app/_components/ButtonLink";

type Props = {
  game: { id: string; name: string; ruleType: RuleNames };
  logsLength: number;
  onUndo: () => void;
  onThrough: () => void;
  _preferences: UserPreferencesType | null;
};

const ActionButtons: React.FC<Props> = ({
  game,
  logsLength,
  onUndo,
  onThrough,
  _preferences,
}) => {
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
            onClick={onThrough}
          >
            スルー
          </Button>
          <Button
            size="xs"
            variant="default"
            leftSection={<IconArrowBackUp size={20} />}
            disabled={logsLength === 0}
            onClick={onUndo}
          >
            一つ戻す
          </Button>
          {typeof document !== "undefined" && document.fullscreenEnabled && (
            <Button
              visibleFrom="md"
              size="xs"
              variant="default"
              leftSection={<IconMaximize size={20} />}
              onClick={() => {
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
            href={`/online/games/${game.id}/config`}
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
