"use client";

import { useRouter } from "next/navigation";

import { Box, Button, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { IconTrash } from "@tabler/icons-react";

import db from "@/utils/db";
import { rules } from "@/utils/rules";
import { GamePropsUnion } from "@/utils/types";

type CopyGamePropsUnion = {
  game: GamePropsUnion;
  currentProfile: string;
};

const DeleteGame: React.FC<CopyGamePropsUnion> = ({ game, currentProfile }) => {
  const router = useRouter();

  const deleteGame = async () => {
    await db(currentProfile).games.delete(game.id);
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
    router.refresh();
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
      >
        削除する
      </Button>
    </Box>
  );
};

export default DeleteGame;
