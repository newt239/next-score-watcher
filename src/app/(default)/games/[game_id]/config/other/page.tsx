import type { Metadata } from "next";

import OtherTab from "./_components/OtherTab";

export const metadata: Metadata = {
  title: "ゲーム設定 - その他の設定",
  robots: {
    index: false,
  },
};

const OtherPage = () => <OtherTab />;

export default OtherPage;
