import { useRef, useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { DeviceFloppy } from "tabler-icons-react";

import db from "#/utils/db";
import { PlayerDBProps } from "#/utils/types";

type EditPlayertagsModalProps = {
  selectedPlayers: PlayerDBProps[];
  isOpen: boolean;
  onClose: () => void;
};

const EditPlayertagsModal: React.FC<EditPlayertagsModalProps> = ({
  selectedPlayers,
  isOpen,
  onClose,
}) => {
  const [newTagName, setNewTagName] = useState<string>("");
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <>
      <Modal
        finalFocusRef={finalRef}
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>タグの追加</ModalHeader>
          <ModalCloseButton aria-label="閉じる" />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>新しいタグの名前</FormLabel>
              <Input
                onChange={(e) => setNewTagName(e.target.value)}
                ref={initialRef}
                value={newTagName}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              disabled={newTagName === ""}
              leftIcon={<DeviceFloppy />}
              onClick={async () => {
                await db.players.bulkPut(
                  selectedPlayers.map((player) =>
                    player.tags.includes(newTagName)
                      ? player
                      : { ...player, tags: [...player.tags, newTagName] }
                  )
                );
                setNewTagName("");
                onClose();
              }}
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPlayertagsModal;
