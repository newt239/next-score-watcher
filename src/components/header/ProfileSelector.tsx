import { useState } from "react";

import {
  Box,
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
  useDisclosure,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { Plus } from "tabler-icons-react";

import AlertDialog from "~/components/common/AlertDialog";
import db from "~/utils/db";
import { recordEvent } from "~/utils/ga4";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                p: "8px",
              }}
            >
              <FormControl>
                <FormLabel>選択する</FormLabel>
                <Select
                  defaultValue={currentProfile}
                  onChange={(e) => {
                    recordEvent({
                      action: "change_profile",
                      category: "engagement",
                      label: e.target.value,
                    });
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
                  sx={{
                    mt: "8px",
                  }}
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
              {currentProfile !== "score_watcher" && (
                <FormControl>
                  <FormLabel>削除する</FormLabel>
                  <p>現在のプロファイルを削除します。</p>
                  <Button colorScheme="red" onClick={onOpen}>
                    削除
                  </Button>
                  <AlertDialog
                    body={`現在のプロファイル「${currentProfileName}」を削除します。この操作は取り消せません。`}
                    isOpen={isOpen}
                    onClose={onClose}
                    onConfirm={() => {
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
                    }}
                    title="プロファイルの削除"
                  />
                </FormControl>
              )}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default ProfileSelector;
