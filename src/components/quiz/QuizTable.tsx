import { useRef, useState } from "react";

import {
  Input,
  InputGroup,
  InputLeftElement,
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
  Box,
  HStack,
  useToast,
  Text,
  Textarea,
  Flex,
  IconButton,
  Select,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Checkbox,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DeviceFloppy,
  Edit,
  Filter,
  Trash,
} from "tabler-icons-react";

import H3 from "#/blocks/H3";
import db, { QuizDBProps } from "#/utils/db";

const QuizTable: React.FC = () => {
  const quizes = useLiveQuery(
    () => db.quizes.orderBy("set_name").sortBy("n"),
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
            onChange={() => table.toggleAllRowsSelected()}
            isChecked={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            onChange={() => row.toggleSelected()}
            isChecked={row.getIsSelected()}
          />
        );
      },
    }),
    columnHelper.accessor("n", {
      header: "No.",
    }),
    columnHelper.accessor("q", {
      header: "?????????",
      size: 500,
    }),
    columnHelper.accessor("a", {
      header: "??????",
      size: 250,
    }),
    columnHelper.accessor("set_name", {
      header: "????????????",
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (info) => {
        return (
          <IconButton
            onClick={() => handleChange(info.row.original)}
            colorScheme="blue"
            variant="ghost"
            size="xs"
            aria-label="???????????????????????????"
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
    <Box>
      <H3>????????????</H3>
      {quizes.length === 0 ? (
        <Box p={3}>
          <Text>???????????????????????????????????????</Text>
        </Box>
      ) : (
        <Box>
          {
            <Flex sx={{ py: 5, gap: 3, justifyContent: "flex-end" }}>
              {table.getSelectedRowModel().rows.length !== 0 && (
                <HStack>
                  <Button
                    onClick={async () => {
                      await db.quizes.bulkDelete(
                        table
                          .getSelectedRowModel()
                          .rows.map(({ original: quiz }) => quiz.id)
                      );
                      toast({
                        title: `${
                          table.getSelectedRowModel().rows.length
                        } ?????????????????????????????????`,
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
                    ??????
                  </Button>
                </HStack>
              )}
              <Box>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Filter />
                  </InputLeftElement>
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="??????????????????????????????????????????"
                    sx={{ maxW: 300 }}
                  />
                </InputGroup>
              </Box>
            </Flex>
          }
          {table.getRowModel().rows.length === 0 ? (
            <Box p={3}>
              <Text>
                ???{searchText}?????????????????????????????????????????????????????????????????????
              </Text>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th key={header.id} colSpan={header.colSpan}>
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
                        <Tr key={row.id}>
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={row.id + cell.id}
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
              <Flex
                sx={{
                  py: 5,
                  gap: 3,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <IconButton
                  aria-label="???????????????????????????"
                  icon={<ChevronsLeft />}
                  size="xs"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                />
                <IconButton
                  aria-label="1???????????????"
                  icon={<ChevronLeft />}
                  size="xs"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                />
                <div>
                  {table.getState().pagination.pageIndex + 1} /{" "}
                  {table.getPageCount()}
                </div>
                <IconButton
                  aria-label="1???????????????"
                  icon={<ChevronRight />}
                  size="xs"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                />
                <IconButton
                  aria-label="???????????????????????????"
                  icon={<ChevronsRight />}
                  size="xs"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                />
                <Box>
                  <Select
                    size="sm"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                  >
                    {[10, 50, 100, 300].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}???
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
            </>
          )}
        </Box>
      )}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>??????</ModalHeader>
          <ModalCloseButton aria-label="?????????" />
          {currentQuiz && (
            <>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>?????????</FormLabel>
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
                  <FormLabel>??????</FormLabel>
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
                  <FormLabel>????????????</FormLabel>
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
                  leftIcon={<DeviceFloppy />}
                  onClick={async () => {
                    await db.quizes.update(currentQuiz.id, currentQuiz);
                    onClose();
                  }}
                >
                  ??????
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
