"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  Box,
  Button,
  Card,
  Group,
  Modal,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";
import { parseResponse } from "hono/client";

import classes from "./RuleList.module.css";

import type { RuleNames } from "@/models/games";

import createApiClient from "@/utils/hono/client";
import { rules } from "@/utils/rules";

type Props = {
  userId?: string;
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

const RuleList: React.FC<Props> = ({ userId }) => {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<RuleNames | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) =>
        value.length < 1
          ? "ゲーム名を入力してください"
          : value.length > 100
            ? "ゲーム名は100文字以内で入力してください"
            : null,
    },
  });

  const ruleNameList = Object.keys(rules) as RuleNames[];

  const onClick = (rule_name: RuleNames) => {
    if (!userId) {
      notifications.show({
        title: "エラー",
        message: "ログインが必要です",
        color: "red",
      });
      router.push("/login");
      return;
    }

    setSelectedRule(rule_name);
    const defaultName = generateDefaultGameName(rule_name);
    form.setFieldValue("name", defaultName);
    setCreateModalOpen(true);
  };

  const handleCreateGame = () => {
    if (!selectedRule) return;

    const validation = form.validate();
    if (validation.hasErrors) return;

    startTransition(async () => {
      try {
        const apiClient = await createApiClient();
        const result = await parseResponse(
          apiClient["games"].$post(
            {
              json: [
                {
                  name: form.values.name,
                  ruleType: selectedRule,
                  discordWebhookUrl: "",
                },
              ],
            },
            {
              headers: {
                "x-user-id": userId!,
              },
            }
          )
        );

        if (!("success" in result) || !result.success) {
          throw new Error("ゲームの作成に失敗しました");
        }

        notifications.show({
          title: "成功",
          message: "ゲームを作成しました",
          color: "green",
        });

        setCreateModalOpen(false);
        form.reset();
        setSelectedRule(null);
        router.push(`/online/games/${result.data.ids[0]}/config`);
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

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    form.reset();
    setSelectedRule(null);
  };

  return (
    <>
      <Title order={2}>クラウドゲーム作成</Title>
      <Text size="sm" c="dimmed" mb="md">
        クラウドDBに記録されるゲームを作成します。形式を選択してゲームを作成してください。
      </Text>
      <Box className={classes.rule_list_grid}>
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].short_description;
          return (
            <Card shadow="xs" key={rule_name} withBorder>
              <Card.Section
                withBorder
                inheritPadding
                className={classes.rule_name}
              >
                {rules[rule_name].name}
              </Card.Section>
              <Card.Section className={classes.rule_description}>
                {description}
              </Card.Section>
              <Group justify="flex-end">
                <Button
                  onClick={() => onClick(rule_name)}
                  size="sm"
                  leftSection={<IconCirclePlus />}
                >
                  作る
                </Button>
              </Group>
            </Card>
          );
        })}
      </Box>

      <Modal
        opened={createModalOpen}
        onClose={handleCloseModal}
        title={`${selectedRule ? rules[selectedRule].name : ""}ゲームを作成`}
        size="md"
      >
        <Text size="sm" c="dimmed" mb="md">
          ゲーム名を入力してください。
        </Text>

        <TextInput
          label="ゲーム名"
          placeholder="ゲーム名を入力してください"
          {...form.getInputProps("name")}
          mb="lg"
        />

        <Group justify="flex-end">
          <Button
            variant="outline"
            onClick={handleCloseModal}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleCreateGame}
            loading={isPending}
            disabled={!form.values.name}
          >
            作成
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default RuleList;
