"use client";

import { useTransition } from "react";

import { Button, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import {
  CreatePlayerRequestSchema,
  type CreatePlayerRequestType,
} from "@/models/players";
import apiClient from "@/utils/hono/client";

type Props = {
  currentProfile: string;
  onPlayerCreated: () => Promise<void>;
};

const CreatePlayer: React.FC<Props> = ({
  currentProfile: _currentProfile,
  onPlayerCreated,
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePlayerRequestType>({
    validate: (values) => {
      const result = CreatePlayerRequestSchema.safeParse(values);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((error) => {
          if (error.path.length > 0) {
            errors[error.path[0] as string] = error.message;
          }
        });
        return errors;
      }
      return {};
    },
    initialValues: {
      name: "",
      displayName: "",
      affiliation: "",
      description: "",
    },
  });

  const handleCreatePlayer = (values: CreatePlayerRequestType) => {
    startTransition(async () => {
      try {
        const response = await apiClient.players.$post({ json: values });

        if (!response.ok) {
          throw new Error("プレイヤーの作成に失敗しました");
        }

        await response.json();

        notifications.show({
          title: "プレイヤーを作成しました",
          message: `${values.displayName} を追加しました`,
          color: "green",
        });

        form.reset();
        await onPlayerCreated();
      } catch (error) {
        notifications.show({
          title: "エラー",
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました",
          color: "red",
        });
      }
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleCreatePlayer)}>
      <TextInput
        label="氏名"
        required
        {...form.getInputProps("name")}
        disabled={isPending}
      />
      <TextInput
        label="表示名"
        required
        mt="md"
        {...form.getInputProps("displayName")}
        disabled={isPending}
      />
      <TextInput
        label="所属"
        mt="md"
        {...form.getInputProps("affiliation")}
        disabled={isPending}
      />
      <Textarea
        label="説明"
        mt="md"
        {...form.getInputProps("description")}
        disabled={isPending}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={isPending} loading={isPending}>
          作成
        </Button>
      </Group>
    </form>
  );
};

export default CreatePlayer;
