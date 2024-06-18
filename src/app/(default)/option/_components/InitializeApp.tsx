"use client";

import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

import db from "@/utils/db";

const InitializeApp: React.FC = () => {
  const deleteAppData = () => {
    window.localStorage.removeItem("scorewatcher-version");
    db()
      .delete()
      .then(() => {
        window.document.location.reload();
      });
  };

  const openInitializeModal = () => {
    modals.openConfirmModal({
      title: "アプリの初期化",
      children: (
        <Text>アプリのデータを初期化します。この操作は取り消せません。</Text>
      ),
      labels: { confirm: "初期化する", cancel: "初期化しない" },
      confirmProps: { color: "red" },
      onConfirm: deleteAppData,
    });
  };
  return (
    <>
      <h3>アプリの初期化</h3>
      <Group justify="space-between" gap="1rem" mb="lg">
        <Text>アプリが上手く動作しない場合にお試しください。</Text>
        <Button onClick={openInitializeModal} color="red">
          初期化する
        </Button>
      </Group>
    </>
  );
};

export default InitializeApp;
