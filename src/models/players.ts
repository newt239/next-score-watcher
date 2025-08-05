import { z } from "zod";

/**
 * プレイヤー作成時のスキーマ
 */
export const CreatePlayerSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  affiliation: z.string().optional(),
  description: z.string().optional(),
});

/**
 * プレイヤー作成データの型
 */
export type CreatePlayerData = z.infer<typeof CreatePlayerSchema>;
