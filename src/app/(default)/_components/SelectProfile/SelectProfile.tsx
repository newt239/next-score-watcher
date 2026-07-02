"use client";

import { useState } from "react";

import { Button, Flex, NativeSelect, Popover, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { sendGAEvent } from "@next/third-parties/google";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { nanoid } from "nanoid";

import {
  CURRENT_PROFILE_STORAGE_KEY,
  DEFAULT_CURRENT_PROFILE,
  PROFILE_LIST_STORAGE_KEY,
  type ProfileListItem,
} from "@/utils/current-profile";
import db from "@/utils/db";

const SelectProfile: React.FC = () => {
  const [storedCurrentProfile, setCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: DEFAULT_CURRENT_PROFILE,
  });
  const [profileList, setProfileList] = useLocalStorage<ProfileListItem[]>({
    key: PROFILE_LIST_STORAGE_KEY,
    defaultValue: [],
  });
  const currentProfileName = profileList.find((p) => p.id === storedCurrentProfile)
    ? decodeURI(profileList.find((p) => p.id === storedCurrentProfile)!.name)
    : "デフォルト";
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
            mt="sm"
            label="選択する"
            value={storedCurrentProfile}
            onChange={(e) => {
              const profileId = e.target.value;
              sendGAEvent("event", "change_profile", { profile_id: profileId });
              setCurrentProfile(profileId);
              window.location.reload();
            }}
          >
            {profileList.map((p) => (
              <option key={p.id} value={p.id}>
                {decodeURI(p.name)}
              </option>
            ))}
            <option value="score_watcher">デフォルト</option>
          </NativeSelect>
          <TextInput
            mt="sm"
            label="新しく作る"
            placeholder="プロファイル名"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <Button
            mt="lg"
            disabled={newProfileName === ""}
            leftSection={<IconPlus />}
            onClick={() => {
              const newProfileId = `profile_${nanoid()}`;
              const newProfileList = [
                ...profileList,
                { name: encodeURI(newProfileName), id: newProfileId },
              ];
              setProfileList(newProfileList);
              setCurrentProfile(newProfileId);
              window.location.reload();
            }}
          >
            作成
          </Button>
          {storedCurrentProfile !== DEFAULT_CURRENT_PROFILE && (
            <Button
              color="red"
              leftSection={<IconTrash />}
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
                    const newProfileList = profileList.filter((p) => p.id !== storedCurrentProfile);
                    setProfileList(newProfileList);
                    setCurrentProfile(DEFAULT_CURRENT_PROFILE);
                    db(storedCurrentProfile)
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

export default SelectProfile;
