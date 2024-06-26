import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import ShortcutGuide from "~/features/board/ShortcutGuide";
import Preferences from "~/features/components/Preferences";

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
                <p>
                  一部の設定はボタンクリック等何らかのアクション後に反映されます。
                </p>
                <Preferences />
              </TabPanel>
              <TabPanel>
                <ShortcutGuide />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            閉じる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PreferenceModal;
