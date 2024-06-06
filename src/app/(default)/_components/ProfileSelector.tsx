"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  NativeSelect,
  Popover,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { nanoid } from "nanoid";
import { Plus } from "tabler-icons-react";

import db from "@/utils/db";

const ProfileSelector: React.FC = () => {
  const raw = window.localStorage.getItem("scorew_profile_list");
  const profileList = (
    raw === undefined || raw === null || raw === "" ? [] : JSON.parse(raw) || []
  ) as { name: string; id: string }[];
  const currentProfile =
    window.localStorage.getItem("scorew_current_profile") || "score_watcher";
  const currentProfileName =
    profileList.find((p) => p.id === currentProfile)?.name || "デフォルト";
  const [newProfileName, setNewProfileName] = useState("");

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "プロファイルの削除",
      centered: true,
      children: (
        <Text size="sm">
          現在のプロファイル「{currentProfileName}
          」を削除します。この操作は取り消せません。
        </Text>
      ),
      labels: { confirm: "削除する", cancel: "削除しない" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        const newProfileList = profileList.filter(
          (p) => p.id !== currentProfile
        );
        window.localStorage.setItem(
          "scorew_profile_list",
          JSON.stringify(newProfileList)
        );
        window.localStorage.setItem("scorew_current_profile", "score_watcher");
        db(currentProfile)
          .delete()
          .then(() => {
            window.location.reload();
          });
      },
    });

  return (
    <Popover width={300} withArrow shadow="md">
      <Popover.Target>
        <Button variant="light">{currentProfileName}</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Title order={4}>プロファイル</Title>
        <Flex className="flex-col gap-4 p-2">
          <Box>
            <Title order={5}>切り替え</Title>
            <NativeSelect
              label="選択する"
              defaultValue={currentProfile}
              onChange={(e) => {
                window.localStorage.setItem(
                  "scorew_current_profile",
                  e.target.value
                );
                window.location.reload();
              }}
            >
              {profileList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="score_watcher">デフォルト</option>
            </NativeSelect>
          </Box>
          <Box>
            <Title order={5}>新しく作る</Title>
            <TextInput
              placeholder="新しいプロファイル名"
              label="プロファイル名"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
            />
            <Button
              className="mt-2"
              disabled={newProfileName === ""}
              leftSection={<Plus />}
              onClick={() => {
                const newProfileId = `profile_${nanoid()}`;
                const newProfileList = [
                  ...profileList,
                  { name: newProfileName, id: newProfileId },
                ];
                window.localStorage.setItem(
                  "scorew_profile_list",
                  JSON.stringify(newProfileList)
                );
                window.localStorage.setItem(
                  "scorew_current_profile",
                  newProfileId
                );
                window.location.reload();
              }}
            >
              作る
            </Button>
          </Box>
          {currentProfile !== "score_watcher" && (
            <>
              <Title>削除する</Title>
              <Text>現在のプロファイルを削除します。</Text>
              <Button onClick={openDeleteModal}>削除する</Button>
            </>
          )}
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ProfileSelector;
