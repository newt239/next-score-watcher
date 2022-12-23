import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Button, Modal } from "semantic-ui-react";

import db from "#/utils/db";

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
    db.delete().then(() => {
      router.reload();
    });
  };
  return (
    <Modal open={modalOpen}>
      <Modal.Header>新しいバージョンがあります</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            現在 v.{currentVersion} を使用中です。 v.{latestVersion}{" "}
            にアップデートします。
          </p>
          <p>
            ※アップデートすると保存されたゲームやクイズデータが削除されます。
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={update} positive>
          アップデート
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateModal;
