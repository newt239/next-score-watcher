import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import Preferences from "../Preferences";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PreferenceModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>表示設定</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Preferences />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={() => {
              onClose();
              document.getElementById("players-area")?.focus();
            }}
          >
            閉じる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PreferenceModal;
