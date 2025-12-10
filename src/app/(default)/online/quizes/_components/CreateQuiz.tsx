"use client";

import { useTransition } from "react";

import { Button, Group, NumberInput, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { CreateQuizSchema, type CreateQuizType } from "@/models/quiz";

type Props = {
  createQuizes: (quizData: CreateQuizType[]) => Promise<number>;
};

const CreateQuiz: React.FC<Props> = ({ createQuizes }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateQuizType>({
    validate: (values) => {
      const result = CreateQuizSchema.safeParse(values);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((error) => {
          if (error.path.length > 0) {
            errors[error.path[0] as string] = error.message;
          }
        });
        return errors;
      }
      return {};
    },
    initialValues: {
      question: "",
      answer: "",
      annotation: "",
      category: "",
      setName: "",
      questionNumber: 1,
    },
  });

  const handleCreateQuiz = (values: CreateQuizType) => {
    startTransition(async () => {
      await createQuizes([values]);
      form.reset();
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleCreateQuiz)}>
      <TextInput label="問題文" required {...form.getInputProps("question")} disabled={isPending} />
      <TextInput
        label="答え"
        required
        mt="md"
        {...form.getInputProps("answer")}
        disabled={isPending}
      />
      <TextInput
        label="セット名"
        required
        mt="md"
        {...form.getInputProps("setName")}
        disabled={isPending}
      />
      <NumberInput
        label="問題番号"
        required
        mt="md"
        min={1}
        {...form.getInputProps("questionNumber")}
        disabled={isPending}
      />
      <TextInput
        label="カテゴリ"
        mt="md"
        {...form.getInputProps("category")}
        disabled={isPending}
      />
      <Textarea
        label="解説・補足"
        mt="md"
        {...form.getInputProps("annotation")}
        disabled={isPending}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={isPending} loading={isPending}>
          作成
        </Button>
      </Group>
    </form>
  );
};

export default CreateQuiz;
