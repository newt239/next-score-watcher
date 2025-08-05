import type { Metadata } from "next";
import { cookies } from "next/headers";

import ManageQuiz from "./_components/ManageQuiz/ManageQuiz";

export const metadata: Metadata = {
  title: "問題管理",
  alternates: {
    canonical: "https://score-watcher.com/quizes",
  },
};

const QuizesPage = async () => {
  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <ManageQuiz currentProfile={currentProfile} />;
};

export default QuizesPage;
