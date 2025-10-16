import { redirect } from "next/navigation";

import { getUser } from "@/utils/auth/auth-helpers";

type CloudRulesLayoutProps = {
  children: React.ReactNode;
};

/**
 * クラウドルール管理ページのレイアウト
 * ユーザーが未ログインの場合は/sign-inにリダイレクトする
 */
const CloudRulesLayout = async ({ children }: CloudRulesLayoutProps) => {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
};

export default CloudRulesLayout;
