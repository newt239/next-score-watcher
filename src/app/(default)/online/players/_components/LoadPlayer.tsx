"use client";

import { useRef, useState, useTransition } from "react";

import { Button, Flex, Group, Radio, RadioGroup, Text, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";

import type { CreatePlayerType } from "@/models/player";

type Props = {
  createPlayers: (playersData: CreatePlayerType[]) => Promise<number>;
};

/**
 * 貼り付けによるプレイヤー一括作成コンポーネント
 */
const LoadPlayer: React.FC<Props> = ({ createPlayers }) => {
  const [rawPlayerText, setRawPlayerText] = useState("");
  const [separateType, setSeparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (rawPlayerText === "") return;

    startTransition(async () => {
      const playerRaw = rawPlayerText.split("\n");
      const playersData: CreatePlayerType[] = [];

      for (const row of playerRaw) {
        const parts = row.split(separateType === "comma" ? "," : "\t");
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

      const createdCount = await createPlayers(playersData);

      notifications.show({
        title: "データをインポートしました",
        message: `貼り付けから${createdCount}件のプレイヤーを読み込みました`,
        autoClose: 9000,
        withCloseButton: true,
      });

      setRawPlayerText("");
      textareaRef.current?.focus();
    });
  };

  const joinString = separateType === "tab" ? "	" : ",";
  const placeholderText = `越山識${joinString}文蔵高校
深見真理${joinString}文蔵高校
  `;

  return (
    <Flex direction="column" gap="md" style={{ paddingTop: "1rem" }}>
      <Text>Excelやスプレッドシートからコピーし、まとめてインポートできます。</Text>
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
        <RadioGroup onChange={(e) => setSeparateType(e as "tab" | "comma")} value={separateType}>
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
