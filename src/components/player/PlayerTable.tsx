import { useRef, useState } from "react";

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
  useColorMode,
  theme,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import DataTable, { createTheme } from "react-data-table-component";
import { Filter, MoodCry, Tags, Trash, X } from "tabler-icons-react";

import EditPlayertagsModal from "./EditPlayerTagsModal";

import H3 from "#/blocks/H3";
import db, { PlayerDBProps } from "#/utils/db";

const PlayerTable: React.FC = () => {
  const { colorMode } = useColorMode();
  const players = useLiveQuery(() => db.players.toArray(), []);
  const [filterText, setFilterText] = useState<string>("");
  const filteredPlayers = players
    ? players.filter(
        (item) =>
          item.name &&
          (item.name.includes(filterText) ||
            item.belong.includes(filterText) ||
            item.tags.join("").includes(filterText))
      )
    : [];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerDBProps | null>(
    null
  );
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerDBProps[]>([]);
  const [editPlayerTagsModal, setEditPlayerTagsModal] =
    useState<boolean>(false);
  const toast = useToast();

  const SubHeaderComponent = () => {
    return (
      <HStack sx={{ gap: 3 }}>
        {selectedPlayers.length !== 0 && (
          <HStack>
            <Button
              onClick={async () => {
                await db.players.bulkDelete(
                  selectedPlayers.map((player) => player.id!)
                );
                toast({
                  title: `${selectedPlayers.length} 人のプレイヤーを削除しました`,
                  description: selectedPlayers
                    .map((player) => `${player.name}(${player.belong})`)
                    .join(",")
                    .slice(0, 20),
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
                setSelectedPlayers([]);
              }}
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
              タグの編集
            </Button>
            <EditPlayertagsModal
              selectedPlayers={selectedPlayers}
              isOpen={editPlayerTagsModal}
              onClose={() => setEditPlayerTagsModal(false)}
            />
          </HStack>
        )}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Filter />
          </InputLeftElement>
          <Input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="氏名・所属・タグで検索"
          />
        </InputGroup>
      </HStack>
    );
  };

  const columns = [
    {
      name: "氏名",
      selector: (row: PlayerDBProps) => row.name,
    },
    {
      name: "所属",
      selector: (row: PlayerDBProps) => row.belong,
    },
    {
      name: "タグ",
      selctor: (row: PlayerDBProps) => row.belong,
      cell: (row: PlayerDBProps) => (
        <div>
          {row.tags.map((tag, i) => (
            <Tag key={i} colorScheme="green">
              <TagLabel>{tag}</TagLabel>
              <TagRightIcon
                sx={{ cursor: "pointer" }}
                onClick={async () => {
                  await db.players.update(row.id!, {
                    tags: row.tags.filter((playerTag) => playerTag !== tag),
                  });
                }}
              >
                <X />
              </TagRightIcon>
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  createTheme("dark", {
    text: {
      primary: colorMode === "dark" && "white",
      secondary: colorMode === "dark" && "white",
    },
    background: {
      default: colorMode === "dark" && theme.colors.gray[800],
    },
    striped: {
      default: colorMode === "dark" && theme.colors.gray[800],
      text: colorMode === "dark" && "white",
    },
    button: {
      default: colorMode === "dark" && "white",
    },
  });

  const handleClick = (row: PlayerDBProps) => {
    setCurrentPlayer(row);
    onOpen();
  };

  return (
    <Box>
      <H3>プレイヤー一覧</H3>
      <DataTable
        columns={columns}
        data={filteredPlayers}
        subHeader
        subHeaderComponent={SubHeaderComponent()}
        onRowDoubleClicked={handleClick}
        onSelectedRowsChange={(e) => setSelectedPlayers(e.selectedRows)}
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
        theme="dark"
      />
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>プレイヤー情報の更新</ModalHeader>
          <ModalCloseButton />
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
                  mr={3}
                  onClick={async () => {
                    await db.players.update(currentPlayer.id!, currentPlayer);
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

export default PlayerTable;
