"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Table, Text, TextInput, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

import Link from "@/app/_components/Link";
import Preferences from "@/app/_components/Preferences";
import db from "@/utils/db";

export default function OptionPage() {
  const latestVersion = process.env.VITE_APP_VERSION;
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setCurrentVersion(window.localStorage.getItem("scorewatcher-version")!);
  }, []);

  const deleteAppData = () => {
    window.localStorage.setItem("scorewatcher-version", latestVersion!);
    db()
      .delete()
      .then(() => {
        router.refresh();
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
      <Title order={2}>アプリ設定</Title>
      <h3>表示設定</h3>
      <Preferences />
      <h3>Webhook</h3>
      <Text>
        イベント発生時に設定されたURLへPOSTリクエストを送信します。 詳しくは
        <Link href="/option/webhook">webhookについて</Link>
        を御覧ください。
      </Text>
      <TextInput />
      <h3>アプリの初期化</h3>
      <Text>アプリが上手く動作しない場合にお試しください。</Text>
      <Button onClick={openInitializeModal} color="red">
        初期化する
      </Button>
      <h3>アプリ情報</h3>
      <p>
        アップデート情報は
        <Link href="https://github.com/newt239/next-score-watcher/releases">
          リリースノート
        </Link>
        をご確認ください。
      </p>
      <div>
        <Table>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>バージョン</Table.Th>
              <Table.Td>v{currentVersion}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>開発者</Table.Th>
              <Table.Td>
                <Link href="https://twitter.com/newt239">newt239</Link>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>リポジトリ</Table.Th>
              <Table.Td>
                <Link href="https://github.com/newt239/next-score-watcher">
                  newt239/next-score-watcher
                </Link>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
}
