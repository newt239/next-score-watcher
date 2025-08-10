"use client";

import { useTransition } from "react";

import { Button, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { CreatePlayerSchema, type CreatePlayerType } from "@/models/players";

type Props = {
  createPlayers: (playerData: CreatePlayerType[]) => Promise<number>;
};

const CreatePlayer: React.FC<Props> = ({ createPlayers }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePlayerType>({
    validate: (values) => {
      const result = CreatePlayerSchema.safeParse(values);
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
      affiliation: "",
      description: "",
    },
  });

  const handleCreatePlayer = (values: CreatePlayerType) => {
    startTransition(async () => {
      await createPlayers([values]);
      form.reset();
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
