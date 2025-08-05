import { redirect } from "next/navigation";

import { getUser } from "@/utils/auth/auth-helpers";

type CloudGamesLayoutProps = {
  children: React.ReactNode;
};

/**
 * クラウドゲーム管理ページのレイアウト
 * ユーザーが未ログインの場合は/sign-inにリダイレクトする
 */
const CloudGamesLayout = async ({ children }: CloudGamesLayoutProps) => {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
};

export default CloudGamesLayout;
