import { ChangeEvent, useEffect, useState } from "react";

import { Button, Card, Form, Input, Table, TextArea } from "semantic-ui-react";

import db from "#/utils/db";

type QuizDataProps = {
  index: number;
  q: string;
  a: string;
};

const LoadQuiz: React.FC = () => {
  const localQuizData = localStorage.getItem("quizData");
  const initialQuizData: QuizDataProps[] = localQuizData
    ? JSON.parse(localQuizData)
    : [];
  const [quizData, setQuizData] = useState<QuizDataProps[]>([]);
  const [rawQuizText, setRawQuizText] = useState(
    initialQuizData.map((quiz) => `${quiz.q} ${quiz.a}\n`).join("")
  );
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");
  const [quizsetName, setQuizsetName] = useState<string>("test");

  useEffect(() => {
    localStorage.setItem("quizData", JSON.stringify(quizData));
  }, [quizData]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length !== 0) {
      const quizRaw = e.target.value.split("\n");
      let dataArray: QuizDataProps[] = [];
      for (let i = 0; i < quizRaw.length; i++) {
        dataArray.push({
          index: Number(
            quizRaw[i].split(separateType === "comma" ? "," : "\t")[0]
          ),
          q: quizRaw[i].split(separateType === "comma" ? "," : "\t")[1],
          a: quizRaw[i].split(separateType === "comma" ? "," : "\t")[2],
        });
      }
      setRawQuizText(e.target.value);
      setQuizData(dataArray);
    }
  };
  const addQuizes = () => {
    db.quizes
      .bulkPut(
        quizData.map((quiz) => {
          return { ...quiz, set_name: quizsetName };
        })
      )
      .then(() => {
        setQuizData([]);
        setRawQuizText("");
      });
  };
  return (
    <Form>
      <Form.Field>
        <label>セット名</label>
        <Input
          value={quizsetName}
          onChange={(e) => {
            setQuizsetName(e.target.value as string);
          }}
        />
      </Form.Field>
      <Form.Field>
        <div style={{ display: "flex", gap: 5 }}>
          <TextArea
            placeholder="1列目を問題番号(半角数字)、2列目を問題文、3列目を答えにしてCSV形式で貼り付けてください"
            value={rawQuizText}
            onChange={handleChange}
            style={{ maxWidth: "50vw" }}
          />
          {quizData.length === 0 ? (
            <Card style={{ margin: 0, width: "100%" }}>
              <Card.Content>ここに問題文が表示されます</Card.Content>
            </Card>
          ) : (
            <Table style={{ margin: 0 }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>問題文</Table.HeaderCell>
                  <Table.HeaderCell>答え</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {quizData.map((quiz, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>{quiz.q}</Table.Cell>
                    <Table.Cell>{quiz.a}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </Form.Field>
      <Form.Field
        style={{ display: "flex", justifyContent: "flex-end", gap: 5 }}
      >
        <Button.Group>
          <Button
            primary={separateType === "comma"}
            onClick={() => setSparateType("comma")}
          >
            ,
          </Button>
          <Button
            primary={separateType === "tab"}
            onClick={() => setSparateType("tab")}
          >
            Tab
          </Button>
        </Button.Group>
        <Button primary disabled={quizData.length === 0} onClick={addQuizes}>
          追加
        </Button>
        <Button
          primary
          disabled={quizData.length === 0}
          onClick={() => {
            setQuizData([]);
            setRawQuizText("");
          }}
        >
          リセット
        </Button>
      </Form.Field>
    </Form>
  );
};

export default LoadQuiz;
