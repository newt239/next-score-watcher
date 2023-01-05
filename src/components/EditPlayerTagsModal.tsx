import { useRef, useState } from "react";

import {
  Input,
  Button,
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Modal,
} from "@chakra-ui/react";

import db, { PlayerDBProps } from "#/utils/db";

interface EditPlayertagsModalProps {
  selectedPlayers: PlayerDBProps[];
  isOpen: boolean;
  onClose: () => void;
}

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
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>タグの編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>新規追加</FormLabel>
              <Input
                ref={initialRef}
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              閉じる
            </Button>
            <Button
              colorScheme="blue"
              disabled={newTagName === ""}
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
