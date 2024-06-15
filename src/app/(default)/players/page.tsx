import { Metadata } from "next";

import ManagePlayer from "./_components/ManagePlayer";

export const metadata: Metadata = {
  title: "プレイヤー管理",
};

export default function PlayerPage() {
  return (
    <>
      <ManagePlayer />
    </>
  );
}
