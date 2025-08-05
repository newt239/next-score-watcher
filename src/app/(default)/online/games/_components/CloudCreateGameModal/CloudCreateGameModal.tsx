"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  Modal,
  Button,
  TextInput,
  Grid,
  Card,
  Text,
  Group,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";

import type { RuleNames } from "@/utils/types";

import apiClient from "@/utils/hono/client";
import { rules } from "@/utils/rules";

type CloudCreateGameModalProps = {
  userId: string;
};

/**
 * ゲーム名の自動生成
 */
const generateDefaultGameName = (ruleType: RuleNames): string => {
  const ruleName = rules[ruleType].name;
  const timestamp = new Date().toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${ruleName} ${timestamp}`;
};

const CloudCreateGameModal: React.FC<CloudCreateGameModalProps> = ({
  userId,
}) => {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    initialValues: {
      name: "",
      ruleType: null as RuleNames | null,
    },
    validate: {
      name: (value) =>
        value.length < 1
          ? "ゲーム名を入力してください"
          : value.length > 100
            ? "ゲーム名は100文字以内で入力してください"
            : null,
      ruleType: (value) =>
        value === null ? "ゲーム形式を選択してください" : null,
    },
  });

  const handleRuleSelect = (ruleName: RuleNames) => {
    form.setFieldValue("ruleType", ruleName);
    const defaultName = generateDefaultGameName(ruleName);
    form.setFieldValue("name", defaultName);
  };

  const handleCreateGame = () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    startTransition(async () => {
      try {
        const response = await apiClient["games"].$post(
          {
            json: {
              name: form.values.name,
              ruleType: form.values.ruleType!,
              discordWebhookUrl: "",
            },
          },
          {
            headers: {
              "x-user-id": userId,
            },
          }
        );

        if (!response.ok) {
          throw new Error("ゲームの作成に失敗しました");
        }

        const result = await response.json();

        notifications.show({
          title: "成功",
          message: "ゲームを作成しました",
          color: "green",
        });

        setCreateModalOpen(false);
        form.reset();
        router.push(`/online/games/${result.gameId}/config`);
      } catch (error) {
        notifications.show({
          title: "エラー",
          message:
            error instanceof Error
              ? error.message
              : "ゲームの作成に失敗しました",
          color: "red",
        });
      }
    });
  };

  const ruleNameList = Object.keys(rules) as RuleNames[];

  return (
    <>
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => setCreateModalOpen(true)}
      >
        新しいゲームを作成
      </Button>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={<Title order={3}>新しいクラウドゲームを作成</Title>}
        size="lg"
      >
        <Text size="sm" c="dimmed" mb="md">
          ゲーム形式を選択してから、ゲーム名を入力してください。
        </Text>

        <Title order={4} mb="sm">
          ゲーム形式を選択
        </Title>
        <Grid mb="lg">
          {ruleNameList.map((ruleName) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={ruleName}>
              <Card
                shadow="xs"
                withBorder
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    form.values.ruleType === ruleName
                      ? "var(--mantine-color-blue-light)"
                      : undefined,
                  borderColor:
                    form.values.ruleType === ruleName
                      ? "var(--mantine-color-blue-6)"
                      : undefined,
                }}
                onClick={() => handleRuleSelect(ruleName)}
              >
                <Text fw={500} size="sm">
                  {rules[ruleName].name}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {rules[ruleName].short_description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <TextInput
          label="ゲーム名"
          placeholder="ゲーム名を入力してください"
          {...form.getInputProps("name")}
          mb="lg"
        />

        <Group justify="flex-end">
          <Button
            variant="outline"
            onClick={() => setCreateModalOpen(false)}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleCreateGame}
            loading={isPending}
            disabled={!form.values.ruleType || !form.values.name}
          >
            作成
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default CloudCreateGameModal;
