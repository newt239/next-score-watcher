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
  Flex,
  IconButton,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import DataTable from "react-data-table-component";
import { Filter, InfoCircle, Tags, Trash, X } from "tabler-icons-react";

import EditPlayertagsModal from "./EditPlayerTagsModal";

import db, { PlayerDBProps } from "#/utils/db";

const PlayerTable: React.FC = () => {
  const players = useLiveQuery(() => db.players.toArray(), []);
  const [filterText, setFilterText] = useState<string>("");
  const filteredPlayers = players
    ? players.filter((item) => item.name && item.name.includes(filterText))
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

  const SubHeaderComponent = () => {
    return (
      <Flex sx={{ alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
        {selectedPlayers.length !== 0 && (
          <>
            <IconButton
              onClick={async () => {
                await db.players.bulkDelete(
                  selectedPlayers.map((player) => player.id!)
                );
              }}
              colorScheme="red"
              size="sm"
              aria-label="削除"
            >
              <Trash />
            </IconButton>
            <IconButton
              onClick={() => setEditPlayerTagsModal(true)}
              colorScheme="green"
              size="sm"
              aria-label="タグの編集"
            >
              <Tags />
            </IconButton>
            <EditPlayertagsModal
              selectedPlayers={selectedPlayers}
              isOpen={editPlayerTagsModal}
              onClose={() => setEditPlayerTagsModal(false)}
            />
          </>
        )}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Filter />
          </InputLeftElement>
          <Input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="氏名で検索"
          />
        </InputGroup>
      </Flex>
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

  const handleClick = (row: PlayerDBProps) => {
    setCurrentPlayer(row);
    onOpen();
  };

  return (
    <>
      <Alert status="info" my={5}>
        <InfoCircle /> ダブルクリックで氏名及び所属を編集できます。
      </Alert>

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
    </>
  );
};

export default PlayerTable;
