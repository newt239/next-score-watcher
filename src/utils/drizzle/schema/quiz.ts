import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { sql } from "drizzle-orm";
import { user } from "./auth";

// クイズセットテーブル
export const quizSet = sqliteTable("quiz_set", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id),
});

// クイズ問題テーブル
export const quizQuestion = sqliteTable("quiz_question", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  quizSetId: text("quiz_set_id").references(() => quizSet.id, {
    onDelete: "cascade",
  }),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  category: text("category"),
  difficultyLevel: integer("difficulty_level"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id),
});

export const quizQuestionUniqueIdx = unique().on(
  quizQuestion.quizSetId,
  quizQuestion.questionNumber
);
