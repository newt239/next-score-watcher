"use client";

/**
 * コピーライトの年表示。
 * DefaultLayout が `dynamic = "force-static"` のためサーバー側ではビルド時の年で固定されるが、
 * クライアント側で再描画して常に最新年を表示する。
 */
const CopyrightYear = () => {
  const currentYear = new Date().getFullYear();
  return <span suppressHydrationWarning>2022-{currentYear}</span>;
};

export default CopyrightYear;
