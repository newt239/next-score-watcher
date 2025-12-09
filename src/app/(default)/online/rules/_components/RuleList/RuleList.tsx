"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Box, Button, Card, Group, Modal, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";
import { parseResponse } from "hono/client";

import classes from "./RuleList.module.css";

import type { RuleNames } from "@/models/game";

import createApiClient from "@/utils/hono/browser";
import { rules } from "@/utils/rules";

const RuleList: React.FC = () => {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<RuleNames | null>(null);
  const [isPending, startTransition] = useTransition();
  const apiClient = createApiClient();

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
    setSelectedRule(rule_name);
    form.setFieldValue("name", rules[rule_name].name);
    setCreateModalOpen(true);
  };

  const handleCreateGame = () => {
    if (!selectedRule) return;

    const validation = form.validate();
    if (validation.hasErrors) return;

    startTransition(async () => {
      const result = await parseResponse(
        apiClient["games"].$post({
          json: [
            {
              name: form.values.name,
              ruleType: selectedRule,
            },
          ],
        })
      );

      setCreateModalOpen(false);
      form.reset();
      setSelectedRule(null);

      if ("error" in result) {
        notifications.show({
          title: "エラー",
          message: String(result.error),
          color: "red",
        });
      } else {
        notifications.show({
          title: "成功",
          message: "ゲームを作成しました",
          color: "green",
        });
        router.push(`/online/games/${result.data.ids[0]}/config`);
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
      <Title order={2}>形式一覧</Title>
      <Text size="sm" c="dimmed" mb="md">
        形式を選択してゲームを作成してください。
      </Text>
      <Box className={classes.rule_list_grid}>
        {ruleNameList.map((rule_name) => {
          const description = rules[rule_name].short_description;
          return (
            <Card shadow="xs" key={rule_name} withBorder>
              <Card.Section withBorder inheritPadding className={classes.rule_name}>
                {rules[rule_name].name}
              </Card.Section>
              <Card.Section className={classes.rule_description}>{description}</Card.Section>
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
          <Button variant="outline" onClick={handleCloseModal} disabled={isPending}>
            キャンセル
          </Button>
          <Button onClick={handleCreateGame} loading={isPending} disabled={!form.values.name}>
            作る
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default RuleList;
