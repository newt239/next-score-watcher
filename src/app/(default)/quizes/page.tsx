import { Metadata } from "next";
import { cookies } from "next/headers";

import ManageQuiz from "./_components/ManageQuiz";

export const metadata: Metadata = {
  title: "問題管理",
};

export default function QuizesPage() {
  const cookieStore = cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <ManageQuiz currentProfile={currentProfile} />;
}
