import { useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  ListItem,
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
  Th,
  Thead,
  Tr,
  UnorderedList,
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

import TablePagination from "~/components/common/TablePagination";
import db from "~/utils/db";
import { PlayerDBProps } from "~/utils/types";

const PlayerTable: React.FC = () => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const games = useLiveQuery(() => db(currentProfile).games.toArray(), []);
  const players = useLiveQuery(
    () => db(currentProfile).players.orderBy("name").toArray(),
    []
  );
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
    columnHelper.accessor("name", {
      header: "氏名",
    }),
    columnHelper.accessor("text", {
      header: "順位",
    }),
    columnHelper.accessor("belong", {
      header: "所属",
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (info) => {
        return (
          <IconButton
            aria-label="プレイヤー情報を更新する"
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
    alertOnClose();
    await db(currentProfile).players.bulkDelete(deletePlayerList);
    await db(currentProfile)
      .logs.where("player_id")
      .anyOf(deletePlayerList)
      .delete();
    await db(currentProfile)
      .games.where("id")
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
  };

  return (
    <Box pt={5}>
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
                <Button
                  colorScheme="red"
                  leftIcon={<Trash />}
                  onClick={alertOnOpen}
                  size="sm"
                >
                  削除
                </Button>
              )}
              <Box>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Filter />
                  </InputLeftElement>
                  <Input
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="フリーワードで検索"
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
                「{searchText}」に一致するプレイヤーは見つかりませんでした。
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
              </TableContainer>
              <TablePagination table={table} />
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
          <ModalHeader>プレイヤー情報の更新</ModalHeader>
          <ModalCloseButton aria-label="閉じる" />
          {currentPlayer && (
            <>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>氏名</FormLabel>
                  <Input
                    onChange={(e) =>
                      setCurrentPlayer({
                        ...currentPlayer,
                        name: e.target.value,
                      })
                    }
                    ref={initialRef}
                    value={currentPlayer.name}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>順位</FormLabel>
                  <Input
                    onChange={(e) =>
                      setCurrentPlayer({
                        ...currentPlayer,
                        text: e.target.value,
                      })
                    }
                    value={currentPlayer.text}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>所属</FormLabel>
                  <Input
                    onChange={(e) =>
                      setCurrentPlayer({
                        ...currentPlayer,
                        belong: e.target.value,
                      })
                    }
                    value={currentPlayer.belong}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  leftIcon={<DeviceFloppy />}
                  onClick={async () => {
                    await db(currentProfile).players.update(
                      currentPlayer.id!,
                      currentPlayer
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
              <Button onClick={alertOnClose} ref={alertCancelRef}>
                やめる
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<Trash />}
                ml={3}
                onClick={deletePlayers}
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
