"use client";

import { useTransition } from "react";

import { Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Encoding from "encoding-japanese";

import type { CreatePlayerRequestType } from "@/models/players";
import type { FileWithPath } from "@mantine/dropzone";

import Dropzone from "@/app/_components/Dropzone/Dropzone";
import apiClient from "@/utils/hono/client";

type Props = {
  currentProfile: string;
  onPlayerCreated: () => void;
};

/**
 * CSVインポートによるプレイヤー一括作成コンポーネント
 */
const ImportPlayer: React.FC<Props> = ({
  currentProfile: _currentProfile,
  onPlayerCreated,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleOnChange = (files: FileWithPath[]) => {
    const fileReader = new FileReader();
    if (files && files.length > 0) {
      const file = files[0];
      fileReader.onload = (ev) => {
        const buffer = ev.target?.result;
        if (buffer instanceof ArrayBuffer) {
          const unicodeArray = Encoding.convert(new Uint8Array(buffer), {
            to: "UNICODE",
            from: "AUTO",
          });
          const encodedString = Encoding.codeToString(unicodeArray);

          startTransition(async () => {
            try {
              const createdCount = await csvFileToArray(encodedString);
              notifications.show({
                title: "データをインポートしました",
                message: `${file.name}から${createdCount}件のプレイヤーデータを読み込みました`,
                autoClose: 9000,
                withCloseButton: true,
              });
              onPlayerCreated();
            } catch (error) {
              notifications.show({
                title: "エラー",
                message:
                  error instanceof Error
                    ? error.message
                    : "プレイヤーのインポートに失敗しました",
                color: "red",
              });
            }
          });
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    const playersData: CreatePlayerRequestType[] = [];

    for (const row of csvRows) {
      const values = row.split(",");
      const name = values[0]?.trim();
      const displayName = values[1]?.trim() || name;
      const affiliation = values[2]?.trim() || undefined;

      if (name) {
        playersData.push({
          name,
          displayName,
          affiliation,
        });
      }
    }

    if (playersData.length === 0) {
      throw new Error("有効なプレイヤーデータがありません");
    }

    const response = await apiClient.players.bulk.$post({
      json: { players: playersData },
    });

    if (!response.ok) {
      throw new Error("プレイヤーの一括作成に失敗しました");
    }

    const data = await response.json();
    if ("success" in data && data.success) {
      return data.data.createdCount;
    } else {
      let errorMessage = "プレイヤーの一括作成に失敗しました";
      if (
        "error" in data &&
        typeof data.error === "object" &&
        data.error &&
        "message" in data.error &&
        typeof data.error.message === "string"
      ) {
        errorMessage = data.error.message;
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <Flex direction="column" gap="md" style={{ paddingTop: "1rem" }}>
      <Dropzone
        onDrop={handleOnChange}
        accept={["text/csv"]}
        loading={isPending}
      />
      <Text>1列目: 氏名、 2列目: 表示名、 3列目: 所属</Text>
    </Flex>
  );
};

export default ImportPlayer;
