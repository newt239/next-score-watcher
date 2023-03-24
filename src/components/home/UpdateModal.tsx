import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
  Icon,
} from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

const UpdateModal: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const currentVersion = localStorage.getItem("scorewatcher-version");
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  useEffect(() => {
    if (!currentVersion) {
      localStorage.setItem("scorewatcher-version", latestVersion!);
    } else if (currentVersion !== latestVersion) {
      setModalOpen(true);
    }
  }, []);

  const update = () => {
    localStorage.setItem("scorewatcher-version", latestVersion!);
    router.reload();
  };

  return (
    <Modal isOpen={modalOpen} onClose={update}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>新しいバージョンがあります</ModalHeader>
        <ModalBody>
          <p>
            現在 v.{currentVersion} を使用中です。 v.{latestVersion}{" "}
            にアップデートします。
          </p>
          <p>
            詳細は
            <Link
              href="https://github.com/newt239/next-score-watcher/releases"
              isExternal
              color="blue.500"
            >
              リリースノート
              <Icon>
                <ExternalLink />
              </Icon>
            </Link>
            をご確認ください。
          </p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={update}>
            アップデート
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateModal;
