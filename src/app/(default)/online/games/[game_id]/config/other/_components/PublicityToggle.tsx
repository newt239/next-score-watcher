"use client";

import { useTransition, useState } from "react";

import {
  Switch,
  Text,
  Group,
  Alert,
  Modal,
  Button,
  List,
  ThemeIcon,
} from "@mantine/core";
import {
  IconGlobe,
  IconInfoCircle,
  IconExclamationCircle,
  IconEye,
  IconUsers,
  IconLock,
} from "@tabler/icons-react";
import { parseResponse } from "hono/client";

import createApiClient from "@/utils/hono/browser";

type PublicityToggleProps = {
  gameId: string;
  isPublic: boolean;
  gameName: string;
};

/**
 * ゲーム公開/非公開切り替えトグルコンポーネント
 */
const PublicityToggle: React.FC<PublicityToggleProps> = ({
  gameId,
  isPublic,
  gameName,
}) => {
  const [isPending, startTransition] = useTransition();
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  /**
   * トグル切り替えハンドラー（確認モーダルを表示）
   */
  const handleToggle = (newValue: boolean) => {
    setPendingValue(newValue);
    setConfirmModalOpened(true);
  };

  /**
   * 実際の公開設定更新処理
   */
  const confirmToggle = () => {
    if (pendingValue === null) return;

    startTransition(async () => {
      try {
        const apiClient = createApiClient();
        const result = await parseResponse(
          apiClient.games[":gameId"].$patch({
            param: { gameId },
            json: { key: "isPublic", value: pendingValue },
          })
        );

        if ("result" in result) {
          setConfirmModalOpened(false);
          setPendingValue(null);
        } else {
          console.error("公開設定の更新に失敗しました:", result.error);
        }
      } catch (error) {
        console.error("公開設定の更新でエラーが発生しました:", error);
      }
    });
  };

  /**
   * 確認モーダルをキャンセル
   */
  const cancelToggle = () => {
    setConfirmModalOpened(false);
    setPendingValue(null);
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={500} size="sm">
            ゲームを公開
          </Text>
          <Text size="xs" c="dimmed">
            認証なしで誰でも観戦できるようになります
          </Text>
        </div>
        <Switch
          checked={isPublic}
          onChange={(event) => handleToggle(event.currentTarget.checked)}
          disabled={isPending}
          size="md"
          thumbIcon={
            isPublic ? (
              <IconGlobe size={14} />
            ) : (
              <div style={{ width: 14, height: 14 }} />
            )
          }
        />
      </Group>

      {isPublic && (
        <Alert variant="light" color="blue" icon={<IconInfoCircle />} mb="md">
          <Text size="sm">
            「{gameName}
            」は現在公開中です。Viewer専用URLから認証なしで観戦できます。
            プレイヤー情報と進行状況がリアルタイムで公開されます。
          </Text>
        </Alert>
      )}

      {/* 確認モーダル */}
      <Modal
        opened={confirmModalOpened}
        onClose={cancelToggle}
        title={
          <Group gap="xs">
            <ThemeIcon color={pendingValue ? "orange" : "blue"} variant="light">
              <IconExclamationCircle size={16} />
            </ThemeIcon>
            <Text fw={500}>
              {pendingValue
                ? "ゲームを公開しますか？"
                : "ゲームを非公開にしますか？"}
            </Text>
          </Group>
        }
        size="md"
      >
        {pendingValue ? (
          <>
            <Alert
              variant="light"
              color="orange"
              icon={<IconExclamationCircle />}
              mb="md"
            >
              <Text size="sm" fw={500} mb="xs">
                以下の内容が公開されます：
              </Text>
              <List size="sm" spacing="xs">
                <List.Item
                  icon={
                    <ThemeIcon color="orange" size={18} radius="xl">
                      <IconEye size={12} />
                    </ThemeIcon>
                  }
                >
                  ゲーム名とクイズ形式
                </List.Item>
                <List.Item
                  icon={
                    <ThemeIcon color="orange" size={18} radius="xl">
                      <IconUsers size={12} />
                    </ThemeIcon>
                  }
                >
                  参加プレイヤーの名前・所属・スコア
                </List.Item>
                <List.Item
                  icon={
                    <ThemeIcon color="orange" size={18} radius="xl">
                      <IconGlobe size={12} />
                    </ThemeIcon>
                  }
                >
                  進行状況とリアルタイム更新
                </List.Item>
              </List>
            </Alert>
            <Text size="sm" c="dimmed" mb="lg">
              この操作により、Viewer専用URLが有効になり、認証なしで誰でもゲームを観戦できるようになります。
            </Text>
          </>
        ) : (
          <>
            <Alert variant="light" color="blue" icon={<IconLock />} mb="md">
              <Text size="sm">
                ゲームが非公開になります。観戦者はアクセスできなくなり、
                シェアされたViewer URLも無効になります。
              </Text>
            </Alert>
          </>
        )}

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={cancelToggle} disabled={isPending}>
            キャンセル
          </Button>
          <Button
            color={pendingValue ? "orange" : "blue"}
            onClick={confirmToggle}
            loading={isPending}
          >
            {pendingValue ? "公開する" : "非公開にする"}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default PublicityToggle;
