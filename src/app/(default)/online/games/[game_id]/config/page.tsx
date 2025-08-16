import { redirect } from "next/navigation";

/**
 * /config へのアクセスを /config/rule にリダイレクト
 */
const ConfigPage = async ({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) => {
  const { game_id } = await params;
  redirect(`/online/games/${game_id}/config/rule`);
};

export default ConfigPage;
