import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

const UpdateModal: React.FC = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const currentVersion = localStorage.getItem("VERSION");
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  useEffect(() => {
    if (!currentVersion) {
      localStorage.setItem("VERSION", latestVersion!);
    } else if (currentVersion !== latestVersion) {
      setModalOpen(true);
    }
  }, []);

  const update = () => {
    localStorage.setItem("VERSION", latestVersion!);
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
