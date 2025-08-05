"use client";

import { useState } from "react";

import { Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { nanoid } from "nanoid";

import classes from "./ManageData.module.css";

import type { FileWithPath } from "@mantine/dropzone";

import Dropzone from "@/app/_components/Dropzone/Dropzone";
import db from "@/utils/db";
import {
  type GamePropsUnion,
  type LogDBProps,
  type PlayerDBProps,
  type QuizDBProps,
} from "@/utils/types";

type Props = {
  profileList: { name: string; id: string }[];
  currentProfile: string;
};

const ManageData: React.FC<Props> = ({ profileList, currentProfile }) => {
  const [input, setInput] = useState<string>("");

  const exportGameData = async () => {
    const data = {
      games: await db(currentProfile).games.toArray(),
      players: await db(currentProfile).players.toArray(),
      quizes: await db(currentProfile).quizes.toArray(),
      logs: await db(currentProfile).logs.toArray(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProfile}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOnChange = (files: FileWithPath[]) => {
    const fileReader = new FileReader();
    if (files && files.length > 0) {
      const file = files[0];
      fileReader.onload = (ev) => {
        const buffer = ev.target?.result;
        const jsonData = JSON.parse(buffer as string) as {
          games: GamePropsUnion[];
          players: PlayerDBProps[];
          quizes: QuizDBProps[];
          logs: LogDBProps[];
        };

        if (typeof jsonData === "object") {
          const newProfileId = `profile_${nanoid()}`;
          const newProfileList = [
            ...profileList,
            { name: encodeURI(input), id: newProfileId },
          ];
          window.document.cookie = `scorew_profile_list=${JSON.stringify(
            newProfileList
          )}`;
          window.document.cookie = `scorew_current_profile=${newProfileId}`;

          if (jsonData.games) {
            db(newProfileId).games.bulkPut(jsonData.games);
          }
          if (jsonData.players) {
            db(newProfileId).players.bulkPut(jsonData.players);
          }
          if (jsonData.quizes) {
            db(newProfileId).quizes.bulkPut(jsonData.quizes);
          }
          if (jsonData.logs) {
            jsonData.logs.forEach((log) => {
              if (log.system !== 1) {
                log.system = 0;
              }
              if (log.available !== 0) {
                log.available = 1;
              }
            });
            db(newProfileId).logs.bulkPut(jsonData.logs);
          }

          window.location.reload();
        }
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <>
      <Title order={3}>エクスポート</Title>
      <Text>
        ゲームデータ及びプレイヤーデータ、クイズ問題データをエクスポートします。
      </Text>
      <Group justify="flex-start" gap="1rem" mb="lg">
        <Button onClick={exportGameData} color="green">
          エクスポート
        </Button>
        <Text>現在のプロファイルのデータをエクスポートします。</Text>
      </Group>
      <Title order={3}>インポート</Title>
      <Stack gap="1rem" mb="lg" className={classes.manage_data}>
        <TextInput
          label="プロファイル名"
          placeholder="〇〇パソコンのデータ"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Dropzone
          disabled={input === ""}
          onDrop={handleOnChange}
          accept={["application/json"]}
        />
      </Stack>
    </>
  );
};

export default ManageData;
