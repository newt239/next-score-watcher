"use client";

import { Button, Group, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

import db from "@/utils/db";

type Props = {
  currentProfile: string;
};

const InitializeApp: React.FC<Props> = ({ currentProfile }) => {
  const deleteAppData = () => {
    window.localStorage.removeItem("scorewatcher-version");
    db(currentProfile)
      .delete()
      .then(() => {
        window.document.location.reload();
      });
  };

  const openInitializeModal = () => {
    modals.openConfirmModal({
      title: "アプリの初期化",
      children: <Text>アプリのデータを初期化します。この操作は取り消せません。</Text>,
      labels: { confirm: "初期化する", cancel: "初期化しない" },
      confirmProps: { color: "red" },
      onConfirm: deleteAppData,
    });
  };

  return (
    <>
      <Title order={3}>アプリの初期化</Title>
      <Group justify="flex-start" gap="1rem" mb="lg">
        <Button onClick={openInitializeModal} color="red">
          初期化する
        </Button>
        <Text>アプリが上手く動作しない場合にお試しください。</Text>
      </Group>
    </>
  );
};

export default InitializeApp;
