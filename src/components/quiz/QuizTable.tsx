import { ReactNode, useMemo, useRef, useState } from "react";

import {
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Modal,
  Alert,
  Box,
  HStack,
  useToast,
  Text,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import DataTable, { createTheme } from "react-data-table-component";
import { Filter, InfoCircle, MoodCry, Trash } from "tabler-icons-react";

import H3 from "#/blocks/H3";
import db, { QuizDBProps } from "#/utils/db";

const QuizTable: React.FC = () => {
  const { colorMode } = useColorMode();
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const [filterText, setFilterText] = useState<string>("");
  const filteredquizes = quizes
    ? quizes.filter(
        (item) => item.q.includes(filterText) || item.a.includes(filterText)
      )
    : [];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizDBProps | null>(null);
  const [selectedQuizes, setSelectedQuizes] = useState<QuizDBProps[]>([]);
  const toast = useToast();

  const SubHeaderComponent = () => {
    return (
      <HStack sx={{ gap: 3 }}>
        {selectedQuizes.length !== 0 && (
          <HStack>
            <Button
              onClick={async () => {
                await db.players.bulkDelete(
                  selectedQuizes.map((player) => player.id!)
                );
                toast({
                  title: `${selectedQuizes.length} 件の問題を削除しました`,
                  description: selectedQuizes
                    .map((quiz) => `${quiz.q} ／ ${quiz.a}`)
                    .join(",")
                    .slice(0, 20),
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
                setSelectedQuizes([]);
              }}
              colorScheme="red"
              size="sm"
              leftIcon={<Trash />}
            >
              削除
            </Button>
          </HStack>
        )}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Filter />
          </InputLeftElement>
          <Input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="問題文・答えで検索"
          />
        </InputGroup>
      </HStack>
    );
  };

  const columns = [
    {
      name: "問題文",
      selector: (row: QuizDBProps) => row.q,
      maxWidth: "70vw",
    },
    {
      name: "答え",
      selector: (row: QuizDBProps) => row.a,
      maxWidth: "30vw",
    },
    {
      name: "セット名",
      selector: (row: QuizDBProps) => row.set_name,
    },
  ];

  const handleClick = (row: QuizDBProps) => {
    setCurrentQuiz(row);
    onOpen();
  };

  createTheme("solarized", {
    text: {
      primary: colorMode === "dark" && "white",
    },
    background: {
      default: colorMode === "dark" && "black",
    },
    striped: {
      default: colorMode === "dark" && "black",
      text: colorMode === "dark" && "white",
    },
  });

  return (
    <Box>
      <H3>問題一覧</H3>
      <Alert status="info" my={5} gap={3}>
        <InfoCircle /> ダブルクリックで問題文・答え・セット名を編集できます。
      </Alert>
      <DataTable
        columns={columns}
        data={filteredquizes}
        subHeader
        subHeaderComponent={SubHeaderComponent()}
        onRowDoubleClicked={handleClick}
        onSelectedRowsChange={(e) => setSelectedQuizes(e.selectedRows)}
        striped
        selectableRows
        dense
        pagination
        paginationRowsPerPageOptions={[10, 50, 100, 500, 1000, 3000]}
        noDataComponent={
          <HStack py={5}>
            <MoodCry />
            <Text>データがありません。</Text>
          </HStack>
        }
        theme="solarized"
      />
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          {currentQuiz && (
            <>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>問題文</FormLabel>
                  <Textarea
                    ref={initialRef}
                    value={currentQuiz.q}
                    onChange={(e) =>
                      setCurrentQuiz({
                        ...currentQuiz,
                        q: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>答え</FormLabel>
                  <Input
                    value={currentQuiz.a}
                    onChange={(e) =>
                      setCurrentQuiz({
                        ...currentQuiz,
                        a: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>セット名</FormLabel>
                  <Input
                    ref={initialRef}
                    value={currentQuiz.set_name}
                    onChange={(e) =>
                      setCurrentQuiz({
                        ...currentQuiz,
                        set_name: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={async () => {
                    await db.quizes.update(currentQuiz.id!, currentQuiz);
                    onClose();
                  }}
                >
                  保存
                </Button>
                <Button onClick={onClose}>閉じる</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuizTable;
