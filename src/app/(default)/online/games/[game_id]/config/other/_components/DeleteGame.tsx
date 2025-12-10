"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Box, Button, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { IconTrash } from "@tabler/icons-react";
import { parseResponse } from "hono/client";

import type { RuleNames } from "@/models/game";

import createApiClient from "@/utils/hono/browser";
import { rules } from "@/utils/rules";

type DeleteGamePropsUnion = {
  gameId: string;
  gameName: string;
  ruleType: RuleNames;
};

/**
 * オンライン版ゲーム削除コンポーネント
 * ゲームの削除機能
 */
const DeleteGame: React.FC<DeleteGamePropsUnion> = ({ gameId, gameName, ruleType }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const apiClient = createApiClient();

  const deleteGame = async () => {
    startTransition(async () => {
      try {
        const result = await parseResponse(
          apiClient.games[":gameId"].$delete({
            param: {
              gameId,
            },
          })
        );

        if ("success" in result) {
          notifications.show({
            title: "ゲームを削除しました",
            message: `${gameName}(${rules[ruleType].name})を削除しました`,
            autoClose: 9000,
            withCloseButton: true,
          });

          sendGAEvent({
            event: "delete_game",
            value: gameId,
          });

          router.push("/online/games");
          router.refresh();
        } else {
          notifications.show({
            title: "エラーが発生しました",
            message: "ゲームの削除に失敗しました",
            color: "red",
            autoClose: 9000,
            withCloseButton: true,
          });
        }
      } catch (error) {
        console.error("Error deleting game:", error);
        notifications.show({
          title: "エラーが発生しました",
          message: "ゲームの削除に失敗しました",
          color: "red",
          autoClose: 9000,
          withCloseButton: true,
        });
      }
    });
  };

  const showDeleteGameConfirm = () => {
    modals.openConfirmModal({
      title: "ゲームを削除",
      centered: true,
      children: (
        <Box>
          <p>ゲーム「{gameName}」を削除します。</p>
          <p>この操作は取り消せません。</p>
        </Box>
      ),
      labels: { confirm: "削除する", cancel: "削除しない" },
      confirmProps: { color: "red" },
      onConfirm: deleteGame,
    });
  };

  return (
    <Box mt="sm">
      <Title order={4}>ゲームを削除</Title>
      <Button
        mt="sm"
        color="red"
        leftSection={<IconTrash />}
        onClick={showDeleteGameConfirm}
        disabled={isPending}
      >
        削除する
      </Button>
    </Box>
  );
};

export default DeleteGame;
