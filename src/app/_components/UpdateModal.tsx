"use client";

import { useEffect, useState } from "react";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Link from "./Link/Link";

const UpdateModal: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>("");
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  useEffect(() => {
    const raw = window.localStorage.getItem("scorewatcher-version");
    if (raw !== latestVersion) {
      setCurrentVersion(raw);
      open();
    }
  }, []);

  const onUpdate = () => {
    window.localStorage.setItem("scorewatcher-version", latestVersion!);
    close();
  };

  const feature = {
    news: "",
    feature: [],
    bugfix: [],
  };

  return (
    <Modal
      opened={opened}
      onClose={onUpdate}
      title="新しいバージョンがリリースされました"
      centered
    >
      <p>
        {currentVersion && `v.${currentVersion} から`} v.{latestVersion}{" "}
        にアップデートしました。
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
              <ul>
                {feature.feature.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}
          {feature.bugfix.length > 0 && (
            <div>
              <h3>🐛不具合修正</h3>
              <ul>
                {feature.bugfix.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <div>
        詳細は
        <Link href="https://github.com/newt239/next-score-watcher/releases">
          リリースノート
        </Link>
        をご確認ください。
      </div>
    </Modal>
  );
};

export default UpdateModal;
