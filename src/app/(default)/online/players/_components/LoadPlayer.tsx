"use client";

import { useRef, useState, useTransition } from "react";

import {
  Button,
  Flex,
  Group,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";

import type { CreatePlayerRequestType } from "@/models/players";

import createApiClient from "@/utils/hono/client";

type Props = {
  onPlayerCreated: () => void;
};

/**
 * 貼り付けによるプレイヤー一括作成コンポーネント
 */
const LoadPlayer: React.FC<Props> = ({ onPlayerCreated }) => {
  const [rawPlayerText, setRawPlayerText] = useState("");
  const [separateType, setSeparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (rawPlayerText === "") return;

    startTransition(async () => {
      try {
        const playerRaw = rawPlayerText.split("\n");
        const playersData: CreatePlayerRequestType[] = [];

        for (let i = 0; i < playerRaw.length; i++) {
          const parts = playerRaw[i].split(
            separateType === "comma" ? "," : "\t"
          );
          const name = parts[0]?.trim();
          const affiliation = parts[1]?.trim();

          if (name) {
            playersData.push({
              name,
              affiliation: affiliation || "",
              description: "",
            });
          }
        }

        if (playersData.length === 0) {
          notifications.show({
            title: "エラー",
            message: "有効なプレイヤーデータがありません",
            color: "red",
          });
          return;
        }

        const apiClient = await createApiClient();
        const response = await apiClient.players.bulk.$post({
          json: { players: playersData },
        });

        if (!response.ok) {
          throw new Error("プレイヤーの一括作成に失敗しました");
        }

        const data = await response.json();

        if ("success" in data && data.success) {
          notifications.show({
            title: "データをインポートしました",
            message: `貼り付けから${data.data.createdCount}件のプレイヤーを読み込みました`,
            autoClose: 9000,
            withCloseButton: true,
          });
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

        setRawPlayerText("");
        textareaRef.current?.focus();
        onPlayerCreated();
      } catch (error) {
        notifications.show({
          title: "エラー",
          message:
            error instanceof Error
              ? error.message
              : "プレイヤーの作成に失敗しました",
          color: "red",
        });
      }
    });
  };

  const joinString = separateType === "tab" ? "	" : ",";
  const placeholderText = `越山識${joinString}文蔵高校
深見真理${joinString}文蔵高校
  `;

  return (
    <Flex direction="column" gap="md" style={{ paddingTop: "1rem" }}>
      <Text>
        Excelやスプレッドシートからコピーし、まとめてインポートできます。
      </Text>
      <Textarea
        rows={4}
        onChange={(e) => setRawPlayerText(e.target.value)}
        placeholder={placeholderText}
        ref={textareaRef}
        value={rawPlayerText}
        disabled={isPending}
      />
      <Text>A列: 氏名、 B列: 所属</Text>
      <Group justify="end">
        <RadioGroup
          onChange={(e) => setSeparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <Group>
            <Radio label="カンマ区切り" value="comma" disabled={isPending} />
            <Radio label="タブ区切り" value="tab" disabled={isPending} />
          </Group>
        </RadioGroup>
        <Button
          disabled={rawPlayerText === "" || isPending}
          leftSection={<IconCirclePlus />}
          onClick={handleClick}
          loading={isPending}
        >
          追加
        </Button>
      </Group>
    </Flex>
  );
};

export default LoadPlayer;
