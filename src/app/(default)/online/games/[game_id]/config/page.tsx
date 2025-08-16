import { redirect } from "next/navigation";

/**
 * /config へのアクセスを /config/rule にリダイレクト
 */
const ConfigPage = async () => {
  redirect("./rule");
};

export default ConfigPage;
