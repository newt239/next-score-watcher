import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

import { features } from "#/utils/features";

const UpdateModal: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const currentVersion = localStorage.getItem("scorewatcher-version");
  const latestVersion = import.meta.env.VITE_APP_VERSION;

  useEffect(() => {
    if (!currentVersion) {
      localStorage.setItem("scorewatcher-version", latestVersion!);
    } else if (currentVersion !== latestVersion) {
      setModalOpen(true);
    }
  }, []);

  const update = () => {
    localStorage.setItem("scorewatcher-version", latestVersion!);
    navigate(0);
  };

  const feature = features[latestVersion];

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
          {feature && (
            <>
              {feature.news && (
                <>
                  <h3>📢お知らせ</h3>
                  {feature.news}
                </>
              )}
              {feature.feature.length > 0 && (
                <>
                  <h3>🎉新機能</h3>
                  <ul>
                    {feature.feature.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </>
              )}
              {feature.bugfix.length > 0 && (
                <>
                  <h3>🐛不具合修正</h3>
                  <ul>
                    {feature.bugfix.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <p style={{ paddingTop: "2rem" }}>
            詳細は
            <Link
              color="blue.500"
              href="https://github.com/newt239/next-score-watcher/releases"
              isExternal
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
