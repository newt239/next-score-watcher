"use client";

import { useEffect, useState } from "react";

const CurrentVersion: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState<string>("");

  useEffect(() => {
    const version = window.localStorage.getItem("scorewatcher-version");
    if (version) {
      setCurrentVersion(version);
    }
  }, []);

  return <>v{currentVersion}</>;
};

export default CurrentVersion;
