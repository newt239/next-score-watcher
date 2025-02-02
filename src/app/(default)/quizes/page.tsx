import { Metadata } from "next";
import { cookies } from "next/headers";

import ManageQuiz from "./_components/ManageQuiz/ManageQuiz";

export const metadata: Metadata = {
  title: "問題管理",
  alternates: {
    canonical: "https://score-watcher.com/quizes",
  },
};

export default async function QuizesPage() {
  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <ManageQuiz currentProfile={currentProfile} />;
}
