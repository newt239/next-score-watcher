"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Box, Button, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { IconTrash } from "@tabler/icons-react";

import type { OnlineGameProps } from "@/models/games";

import createApiClient from "@/utils/hono/client";
import { rules } from "@/utils/rules";

type DeleteGamePropsUnion = {
  game: OnlineGameProps;
};

/**
 * オンライン版ゲーム削除コンポーネント
 * ゲームの削除機能
 */
const DeleteGame: React.FC<DeleteGamePropsUnion> = ({ game }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const deleteGame = async () => {
    startTransition(async () => {
      try {
        const apiClient = createApiClient();
        const response = await apiClient.games.$delete({
          json: [game.id],
        });

        if (!response.ok) {
          throw new Error("Failed to delete game");
        }

        notifications.show({
          title: "ゲームを削除しました",
          message: `${game.name}(${rules[game.rule].name})を削除しました`,
          autoClose: 9000,
          withCloseButton: true,
        });

        sendGAEvent({
          event: "delete_game",
          value: game.id,
        });

        router.push("/online/games");
        router.refresh();
      } catch (error) {
        console.error("Failed to delete game:", error);
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
          <p>ゲーム「{game.name}」を削除します。</p>
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
