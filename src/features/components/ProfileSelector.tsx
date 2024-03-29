import { useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
} from "@chakra-ui/react";
import { css } from "@panda/css";
import { nanoid } from "nanoid";
import { Plus } from "tabler-icons-react";

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
      <PopoverTrigger>
        <Button>{currentProfileName}</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>プロファイルの切り替え</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                p: "8px",
              })}
            >
              <FormControl>
                <FormLabel>選択する</FormLabel>
                <Select
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
                  {profileList.length === 0 && (
                    <option value="score_watcher">デフォルト</option>
                  )}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>新しく作る</FormLabel>
                <Input
                  placeholder="プロファイル名"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
                <Button
                  className={css({
                    mt: "8px",
                  })}
                  isDisabled={newProfileName === ""}
                  leftIcon={<Plus />}
                  colorScheme="green"
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
              </FormControl>
            </div>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default ProfileSelector;
