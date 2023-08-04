import {
  Button,
  HStack,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import Preferences from "#/components/Preferences";

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
          <Tabs isFitted variant="enclosed">
            <TabList>
              <Tab>表示</Tab>
              <Tab>ショートカット</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text>
                  一部の設定はボタンクリック等何らかのアクション後に反映されます。
                </Text>
                <Preferences />
              </TabPanel>
              <TabPanel>
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
                  <HStack sx={{ justifyContent: "space-between" }}>
                    <span>
                      <Kbd>0</Kbd>
                    </span>
                    <span>左から10番目のプレイヤーの正答</span>
                  </HStack>
                  <HStack sx={{ justifyContent: "space-between" }}>
                    <span>
                      <Kbd>-</Kbd>
                    </span>
                    <span>左から11番目のプレイヤーの正答</span>
                  </HStack>
                  <HStack sx={{ justifyContent: "space-between" }}>
                    <span>
                      <Kbd>^</Kbd>
                    </span>
                    <span>左から12番目のプレイヤーの正答</span>
                  </HStack>
                  <HStack sx={{ justifyContent: "space-between" }}>
                    <span>
                      <Kbd>\</Kbd>
                    </span>
                    <span>左から13番目のプレイヤーの正答</span>
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
              </TabPanel>
            </TabPanels>
          </Tabs>
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
