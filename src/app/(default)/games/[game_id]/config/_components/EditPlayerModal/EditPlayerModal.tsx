"use client";

import { useTransition } from "react";

import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import db from "@/utils/db";

import type { PlayerDBProps } from "@/utils/types";

type Props = {
  opened: boolean;
  onClose: () => void;
  player: PlayerDBProps;
  currentProfile: string;
  onNameChange: (name: string) => void;
};

const EditPlayerModal: React.FC<Props> = ({
  opened,
  onClose,
  player,
  currentProfile,
  onNameChange,
}) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: player.name,
      text: player.text,
      belong: player.belong,
      tags: player.tags,
    },
  });

  /** 入力値を元データ(playersテーブル)へ保存し、このゲームの独自名にも反映する */
  const handleSubmit = (values: typeof form.values) => {
    startTransition(async () => {
      try {
        const updated = await db(currentProfile).players.update(player.id, {
          name: values.name,
          text: values.text,
          belong: values.belong,
          tags: values.tags,
        });
        if (updated === 0) {
          notifications.show({
            title: "プレイヤー情報を更新できませんでした",
            message: "対象のプレイヤーが見つかりませんでした",
            color: "red",
            autoClose: 5000,
            withCloseButton: true,
          });
          return;
        }
        onNameChange(values.name);
        notifications.show({
          title: "プレイヤー情報を更新しました",
          message: values.name,
          autoClose: 5000,
          withCloseButton: true,
        });
        onClose();
      } catch (error) {
        notifications.show({
          title: "プレイヤー情報の更新に失敗しました",
          message: error instanceof Error ? error.message : "不明なエラーが発生しました",
          color: "red",
          autoClose: 5000,
          withCloseButton: true,
        });
      }
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="元データを編集" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="氏名"
          placeholder="越山識"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="順位"
          placeholder="24th"
          mt="sm"
          key={form.key("text")}
          {...form.getInputProps("text")}
        />
        <TextInput
          label="所属"
          placeholder="文蔵高校"
          mt="sm"
          key={form.key("belong")}
          {...form.getInputProps("belong")}
        />
        <TagsInput
          label="タグ"
          placeholder="Enterで追加"
          mt="sm"
          key={form.key("tags")}
          {...form.getInputProps("tags")}
        />
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            キャンセル
          </Button>
          <Button type="submit" loading={isPending}>
            保存する
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditPlayerModal;
