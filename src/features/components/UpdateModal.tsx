import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Icon,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
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
                <div>
                  <h3>📢お知らせ</h3>
                  {feature.news}
                </div>
              )}
              {feature.feature.length > 0 && (
                <div>
                  <h3>🎉新機能</h3>
                  <UnorderedList>
                    {feature.feature.map((v, i) => (
                      <ListItem key={i}>{v}</ListItem>
                    ))}
                  </UnorderedList>
                </div>
              )}
              {feature.bugfix.length > 0 && (
                <div>
                  <h3>🐛不具合修正</h3>
                  <UnorderedList>
                    {feature.bugfix.map((v, i) => (
                      <ListItem key={i}>{v}</ListItem>
                    ))}
                  </UnorderedList>
                </div>
              )}
            </>
          )}
          <div>
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
          </div>
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
