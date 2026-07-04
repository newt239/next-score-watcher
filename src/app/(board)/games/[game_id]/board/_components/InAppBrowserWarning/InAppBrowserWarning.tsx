"use client";

import { useEffect } from "react";

import { notifications } from "@mantine/notifications";

/**
 * アプリ内ブラウザで開いている場合に警告通知を表示するコンポーネント
 */
const InAppBrowserWarning: React.FC = () => {
  // UA判定のためブラウザAPIへのアクセスが必要なのでuseEffectを使用する
  useEffect(() => {
    const ua = navigator.userAgent;
    // PWAとして起動している場合はiOSでもUAにSafariが含まれないため除外する
    const isPwa = window.matchMedia(
      "(display-mode: fullscreen), (display-mode: standalone), (display-mode: minimal-ui)"
    ).matches;
    const isIosInAppBrowser = /iP(hone|od|ad)/.test(ua) && !/Safari\//.test(ua);
    const isAndroidWebView = /; wv\)/.test(ua);
    if (!isPwa && (isIosInAppBrowser || isAndroidWebView)) {
      notifications.show({
        id: "in-app-browser-warning",
        title: "アプリ内ブラウザで開いています",
        message:
          "一部機能が正常に動作しない場合があります。SafariやChromeなどのブラウザでの利用を推奨します。",
        color: "yellow",
        autoClose: false,
      });
    }
  }, []);

  return null;
};

export default InAppBrowserWarning;
