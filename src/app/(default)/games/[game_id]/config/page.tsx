import { redirect } from "next/navigation";

const ConfigPage = async ({ params }: { params: Promise<{ game_id: string }> }) => {
  const { game_id } = await params;
  redirect(`/games/${game_id}/config/player`);
};

export default ConfigPage;
