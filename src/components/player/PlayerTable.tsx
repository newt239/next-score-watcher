import { useRef, useState } from "react";
import { Link as ReactLink } from "react-router-dom";

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
  TagLabel,
  TagRightIcon,
  Box,
  HStack,
  useToast,
  Text,
  IconButton,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
  Flex,
  Checkbox,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type FilterFn,
  type ColumnDef,
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
  InfoCircle,
  Tags,
  Trash,
  X,
} from "tabler-icons-react";

import EditPlayertagsModal from "./EditPlayerTagsModal";

import db, { PlayerDBProps } from "#/utils/db";

const PlayerTable: React.FC = () => {
  const games = useLiveQuery(() => db.games.toArray(), []);
  const players = useLiveQuery(() => db.players.orderBy("name").toArray(), []);
  const [searchText, setSearchText] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const {
    isOpen: alertIsOpen,
    onOpen: alertOnOpen,
    onClose: alertOnClose,
  } = useDisclosure();
  const alertCancelRef = useRef(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerDBProps | null>(
    null
  );
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [editPlayerTagsModal, setEditPlayerTagsModal] =
    useState<boolean>(false);
  const toast = useToast();

  const handleChange = (row: PlayerDBProps) => {
    setCurrentPlayer(row);
    onOpen();
  };

  const fuzzyFilter: FilterFn<PlayerDBProps> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.text?.includes(searchText) ||
      data.belong?.includes(searchText) ||
      data.tags.join("").includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<PlayerDBProps>();
  const columns: ColumnDef<PlayerDBProps, any>[] = [
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
    columnHelper.accessor("name", {
      header: "氏名",
    }),
    columnHelper.accessor("text", {
      header: "サブテキスト",
    }),
    columnHelper.accessor("belong", {
      header: "所属",
    }),
    columnHelper.accessor("tags", {
      header: "タグ",
      cell: (info) => {
        return info.row.original.tags.map((tag, tagi) => (
          <Tag key={tagi} colorScheme="green" size="sm">
            <TagLabel>{tag}</TagLabel>
            <TagRightIcon
              sx={{ cursor: "pointer" }}
              onClick={async () => {
                await db.players.update(info.row.original.id, {
                  tags: info.row.original.tags.filter(
                    (playerTag) => playerTag !== tag
                  ),
                });
              }}
            >
              <X />
            </TagRightIcon>
          </Tag>
        ));
      },
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
            aria-label="プレイヤー情報を更新する"
          >
            <Edit />
          </IconButton>
        );
      },
    }),
  ];

  const table = useReactTable<PlayerDBProps>({
    data: players || [],
    columns,
    state: {
      rowSelection: selectedPlayers,
      globalFilter: searchText,
    },
    onRowSelectionChange: setSelectedPlayers,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!games || !players) return null;

  const deletePlayerList = table
    .getSelectedRowModel()
    .rows.map(({ original: player }) => player.id);
  const affectedGameList = games.filter((game) =>
    game.players
      .map((gamePlayer) => deletePlayerList.includes(gamePlayer.id))
      .includes(true)
  );

  const deletePlayers = async () => {
    await db.players.bulkDelete(deletePlayerList);
    await db.logs.where("player_id").anyOf(deletePlayerList).delete();
    await db.games
      .where("id")
      .anyOf(affectedGameList.map((game) => game.id))
      .modify({ players: [] });
    toast({
      title: `${deletePlayerList.length}人のプレイヤーを削除しました`,
      description: table
        .getSelectedRowModel()
        .rows.map(({ original: player }) => player.name)
        .join(", ")
        .slice(0, 20),
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setSelectedPlayers([]);
    alertOnClose();
  };

  return (
    <Box>
      <h3>プレイヤー一覧</h3>
      {players.length === 0 ? (
        <Box p={3}>
          <Text>プレイヤーが登録されていません。</Text>
        </Box>
      ) : (
        <Box>
          {
            <Flex sx={{ pb: 5, gap: 3, justifyContent: "flex-end" }}>
              {table.getSelectedRowModel().rows.length !== 0 && (
                <HStack>
                  <Button
                    onClick={alertOnOpen}
                    colorScheme="red"
                    size="sm"
                    leftIcon={<Trash />}
                  >
                    削除
                  </Button>
                  <Button
                    onClick={() => setEditPlayerTagsModal(true)}
                    colorScheme="green"
                    size="sm"
                    leftIcon={<Tags />}
                  >
                    タグを追加
                  </Button>
                  <EditPlayertagsModal
                    selectedPlayers={table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original)}
                    isOpen={editPlayerTagsModal}
                    onClose={() => setEditPlayerTagsModal(false)}
                  />
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
                    placeholder="フリーワードで検索"
                    sx={{ maxW: 300 }}
                  />
                </InputGroup>
              </Box>
            </Flex>
          }
          {table.getRowModel().rows.length === 0 ? (
            <Box p={3}>
              <Text>
                「{searchText}」に一致するプレイヤーは見つかりませんでした。
              </Text>
            </Box>
          ) : (
            <TableContainer>
              <Table size="sm">
                <Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, i) => (
                        <Th key={i} colSpan={header.colSpan}>
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
                            <Td key={`${row.original.id}_${i}`}>
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
              <Flex
                sx={{
                  py: 5,
                  gap: 3,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <IconButton
                  aria-label="最初のページに移動"
                  icon={<ChevronsLeft />}
                  size="xs"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                />
                <IconButton
                  aria-label="1ページ戻る"
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
                  aria-label="1ページ進む"
                  icon={<ChevronRight />}
                  size="xs"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                />
                <IconButton
                  aria-label="最後のページに移動"
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
                    {[10, 50, 100, 200, 300].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}件
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
            </TableContainer>
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
          <ModalHeader>プレイヤー情報の更新</ModalHeader>
          <ModalCloseButton aria-label="閉じる" />
          {currentPlayer && (
            <>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>氏名</FormLabel>
                  <Input
                    ref={initialRef}
                    value={currentPlayer.name}
                    onChange={(e) =>
                      setCurrentPlayer({
                        ...currentPlayer,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>サブテキスト</FormLabel>
                  <Input
                    value={currentPlayer.text}
                    onChange={(e) =>
                      setCurrentPlayer({
                        ...currentPlayer,
                        text: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>所属</FormLabel>
                  <Input
                    value={currentPlayer.belong}
                    onChange={(e) =>
                      setCurrentPlayer({
                        ...currentPlayer,
                        belong: e.target.value,
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
                    await db.players.update(currentPlayer.id!, currentPlayer);
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
      <AlertDialog
        isOpen={alertIsOpen}
        leastDestructiveRef={alertCancelRef}
        onClose={alertOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              プレイヤーを削除します
            </AlertDialogHeader>
            <AlertDialogBody>
              選択中のプレイヤー{deletePlayerList.length}
              人を削除します。
              {affectedGameList.length !== 0 && (
                <>
                  この操作により、以下{affectedGameList.length}
                  件のゲームのプレイヤーの選択状態及びログがリセットされます。
                  <UnorderedList>
                    {affectedGameList.map((game) => (
                      <ListItem key={game.id}>{game.name}</ListItem>
                    ))}
                  </UnorderedList>
                </>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={alertOnClose}>
                やめる
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<Trash />}
                onClick={deletePlayers}
                ml={3}
              >
                削除する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
export default PlayerTable;
