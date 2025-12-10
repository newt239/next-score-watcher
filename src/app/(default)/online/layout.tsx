import { redirect } from "next/navigation";

import { getUser } from "@/utils/auth/auth-helpers";

type OnlineLayoutProps = {
  children: React.ReactNode;
};

/**
 * オンライン版のレイアウト
 * ユーザーが未ログインの場合は/sign-inにリダイレクトする
 */
const OnlineLayout = async ({ children }: OnlineLayoutProps) => {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
};

export default OnlineLayout;
