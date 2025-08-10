import { redirect } from "next/navigation";

import { getUser } from "@/utils/auth/auth-helpers";

type GamesLayoutProps = {
  children: React.ReactNode;
};

/**
 * ゲーム管理ページのレイアウト
 * ユーザーが未ログインの場合は/sign-inにリダイレクトする
 */
const GamesLayout = async ({ children }: GamesLayoutProps) => {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
};

export default GamesLayout;
