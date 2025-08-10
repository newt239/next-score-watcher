"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import type { RuleNames } from "@/utils/types";

import PreferenceDrawer from "@/app/(board)/games/[game_id]/board/_components/PreferenceDrawer";
import { rules } from "@/utils/rules";

type Props = {
  game: { id: string; name: string; ruleType: RuleNames };
  logsLength: number;
  onUndo: () => void;
};

const OnlineBoardHeader: React.FC<Props> = ({ game, logsLength, onUndo }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  };

  const ruleLabel = rules[game.ruleType]?.name || game.ruleType;

  return (
    <Stack gap={4} mb="xs">
      <Group justify="space-between">
        <Text size="lg" fw={700}>
          {game.name}
        </Text>
        <Group gap="xs">
          <Button
            size="xs"
            variant="default"
            onClick={onUndo}
            disabled={logsLength === 0}
          >
            一つ戻す
          </Button>
          {document.fullscreenEnabled && (
            <Button size="xs" variant="default" onClick={toggleFullscreen}>
              フルスクリーン
            </Button>
          )}
          <Button size="xs" variant="default" onClick={open}>
            表示設定
          </Button>
          <Button
            size="xs"
            variant="default"
            component="a"
            href={`/online/games/${game.id}/config`}
          >
            設定
          </Button>
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {ruleLabel}
      </Text>
      <PreferenceDrawer isOpen={opened} onClose={close} />
    </Stack>
  );
};

export default OnlineBoardHeader;
