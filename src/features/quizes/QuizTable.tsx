import { useRef, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import { DeviceFloppy, Edit, Filter, Trash } from "tabler-icons-react";

import TablePagenation from "~/components/TablePagination";
import db from "~/utils/db";
import { QuizDBProps } from "~/utils/types";

const QuizTable: React.FC = () => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const quizes = useLiveQuery(
    () => db(currentProfile).quizes.orderBy("set_name").sortBy("n"),
    []
  );
  const [searchText, setSearchText] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizDBProps | null>(null);
  const [selectedQuizes, setSelectedQuizes] = useState({});
  const toast = useToast();

  const handleChange = (row: QuizDBProps) => {
    setCurrentQuiz(row);
    onOpen();
  };

  const fuzzyFilter: FilterFn<QuizDBProps> = (row) => {
    const data = row.original;
    return (
      data.q?.includes(searchText) ||
      data.a?.includes(searchText) ||
      data.set_name?.includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<QuizDBProps>();
  const columns: ColumnDef<QuizDBProps, any>[] = [
    columnHelper.accessor("id", {
      header: ({ table }) => {
        return (
          <Checkbox
            isChecked={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={() => table.toggleAllRowsSelected()}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            isChecked={row.getIsSelected()}
            onChange={() => row.toggleSelected()}
          />
        );
      },
    }),
    columnHelper.accessor("n", {
      header: "No.",
    }),
    columnHelper.accessor("q", {
      header: "問題文",
      size: 500,
    }),
    columnHelper.accessor("a", {
      header: "答え",
      size: 250,
    }),
    columnHelper.accessor("set_name", {
      header: "セット名",
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (info) => {
        return (
          <IconButton
            aria-label="問題情報を更新する"
            colorScheme="blue"
            onClick={() => handleChange(info.row.original)}
            size="xs"
            variant="ghost"
          >
            <Edit />
          </IconButton>
        );
      },
    }),
  ];

  const table = useReactTable<QuizDBProps>({
    data: quizes || [],
    columns,
    state: {
      rowSelection: selectedQuizes,
      globalFilter: searchText,
    },
    onRowSelectionChange: setSelectedQuizes,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!quizes) return null;

  return (
    <Box pt={5}>
      <h3>問題一覧</h3>
      {quizes.length === 0 ? (
        <Box p={3}>
          <Text>問題が登録されていません。</Text>
        </Box>
      ) : (
        <Box>
          {
            <Flex sx={{ py: 5, gap: 3, justifyContent: "flex-end" }}>
              {table.getSelectedRowModel().rows.length !== 0 && (
                <HStack>
                  <Button
                    colorScheme="red"
                    leftIcon={<Trash />}
                    onClick={async () => {
                      await db(currentProfile).quizes.bulkDelete(
                        table
                          .getSelectedRowModel()
                          .rows.map(({ original: quiz }) => quiz.id)
                      );
                      toast({
                        title: `${
                          table.getSelectedRowModel().rows.length
                        } 件の問題を削除しました`,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                      });
                      setSelectedQuizes([]);
                    }}
                    size="sm"
                  >
                    削除
                  </Button>
                </HStack>
              )}
              <Box>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Filter />
                  </InputLeftElement>
                  <Input
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="問題文・答え・セット名で検索"
                    sx={{ maxW: 300 }}
                    value={searchText}
                  />
                </InputGroup>
              </Box>
            </Flex>
          }
          {table.getRowModel().rows.length === 0 ? (
            <Box p={3}>
              <Text>
                「{searchText}」に一致する問題データは見つかりませんでした。
              </Text>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header, i) => (
                          <Th colSpan={header.colSpan} key={i}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </Thead>
                  <Tbody>
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <Tr key={row.original.id}>
                          {row.getVisibleCells().map((cell, i) => {
                            return (
                              <Td
                                key={`${row.original.id}_${i}`}
                                maxW={cell.column.id === "q" ? 500 : 300}
                                overflow="hidden"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
              <TablePagenation table={table} />
            </>
          )}
        </Box>
      )}
      <Modal
        finalFocusRef={finalRef}
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton aria-label="閉じる" />
          {currentQuiz && (
            <>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>問題文</FormLabel>
                  <Textarea
                    onChange={(e) =>
                      setCurrentQuiz({
                        ...currentQuiz,
                        q: e.target.value,
                      })
                    }
                    ref={initialRef}
                    value={currentQuiz.q}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>答え</FormLabel>
                  <Input
                    onChange={(e) =>
                      setCurrentQuiz({
                        ...currentQuiz,
                        a: e.target.value,
                      })
                    }
                    value={currentQuiz.a}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>セット名</FormLabel>
                  <Input
                    onChange={(e) =>
                      setCurrentQuiz({
                        ...currentQuiz,
                        set_name: e.target.value,
                      })
                    }
                    ref={initialRef}
                    value={currentQuiz.set_name}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  leftIcon={<DeviceFloppy />}
                  onClick={async () => {
                    await db(currentProfile).quizes.update(
                      currentQuiz.id,
                      currentQuiz
                    );
                    onClose();
                  }}
                >
                  保存
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuizTable;
