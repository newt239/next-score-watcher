import {
  Button,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  HStack,
} from "@chakra-ui/react";

type ShortcutGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ShortcutGuideModal: React.FC<ShortcutGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ショートカットキー一覧</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          ※まず画面中央付近をクリックし、フォーカスを移動させてください。
          <Stack>
            <HStack sx={{ justifyContent: "space-between" }}>
              <span>
                <Kbd>1</Kbd>
              </span>
              <span>左から1番目のプレイヤーの正答</span>
            </HStack>
            <HStack sx={{ justifyContent: "space-between" }}>
              <span>
                <Kbd>2</Kbd>
              </span>
              <span>左から2番目のプレイヤーの正答</span>
            </HStack>
            <div style={{ margin: "auto", marginTop: "0.5rem" }}>
              ～～～～～
            </div>
            <HStack sx={{ justifyContent: "space-between" }}>
              <span>
                <Kbd>0</Kbd>
              </span>
              <span>左から10番目のプレイヤーの正答</span>
            </HStack>
            <HStack sx={{ justifyContent: "space-between" }}>
              <span>
                <Kbd>shift</Kbd> + <Kbd>1</Kbd>
              </span>
              <span>左から1番目のプレイヤーの誤答</span>
            </HStack>
            <HStack sx={{ justifyContent: "space-between" }}>
              <span>
                <Kbd>{"<"}</Kbd>
              </span>
              <span>一つ戻す</span>
            </HStack>
            <HStack sx={{ justifyContent: "space-between" }}>
              <span>
                <Kbd>{">"}</Kbd>
              </span>
              <span>スルー</span>
            </HStack>
          </Stack>
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

export default ShortcutGuideModal;
