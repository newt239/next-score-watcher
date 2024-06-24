"use client";

import { useState } from "react";

import {
  Button,
  Flex,
  NativeSelect,
  Popover,
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

  return (
    <Popover>
      <Popover.Target>
        <Button>{currentProfileName}</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Title order={4}>プロファイルの切り替え</Title>
        <Flex direction="column" gap={4} p={2}>
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
          <TextInput
            label="新しく作る"
            placeholder="プロファイル名"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <Button
            mt="lg"
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
            作成
          </Button>
          {currentProfile !== "score_watcher" && (
            <Button
              color="red"
              onClick={() =>
                modals.openConfirmModal({
                  title: "プロファイルの削除",
                  centered: true,
                  children: (
                    <>
                      現在のプロファイル「{currentProfileName}
                      」を削除します。この操作は取り消せません。
                    </>
                  ),
                  labels: { confirm: "削除する", cancel: "削除しない" },
                  confirmProps: { color: "red" },
                  onConfirm: () => {
                    const newProfileList = profileList.filter(
                      (p) => p.id !== currentProfile
                    );
                    window.localStorage.setItem(
                      "scorew_profile_list",
                      JSON.stringify(newProfileList)
                    );
                    window.localStorage.setItem(
                      "scorew_current_profile",
                      "score_watcher"
                    );
                    db(currentProfile)
                      .delete()
                      .then(() => {
                        window.location.reload();
                      });
                  },
                })
              }
            >
              削除
            </Button>
          )}
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ProfileSelector;