import {
  Button,
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
import { useState } from "react";

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
            <h3>選択する</h3>
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
            </Select>
            <h3>新しく作る</h3>
            <Input placeholder="プロファイル名" />
            <Button
              colorScheme="green"
              onClick={() => {
                const newProfileId = `profile_${Date.now()}`;
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
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default ProfileSelector;
