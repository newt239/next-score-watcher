"use client";

import { useEffect, useState } from "react";

const CurrentVersion: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState<string>("");

  useEffect(() => {
    const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION!;
    const version = window.localStorage.getItem("scorewatcher-version");
    if (version !== latestVersion) {
      setCurrentVersion(latestVersion);
    } else {
      setCurrentVersion(version || "");
    }
  }, []);

  return <>v{currentVersion}</>;
};

export default CurrentVersion;
