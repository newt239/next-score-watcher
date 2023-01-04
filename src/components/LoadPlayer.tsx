import { ChangeEventHandler, useState } from "react";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import H2 from "#/blocks/H2";
import db, { PlayerDBProps } from "#/utils/db";

const LoadPlayer: React.FC = () => {
  const players = useLiveQuery(() => db.players.toArray(), []);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const fileReader = new FileReader();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      fileReader.onload = (ev) => {
        const csvOutput = ev.target?.result;
        if (typeof csvOutput === "string") {
          csvFileToArray(csvOutput);
        }
      };
      fileReader.readAsText(files[0], "Shift_JIS");
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    await db.players.bulkPut(
      csvRows.map((row) => {
        const values = row.split(",");
        return {
          name: values[0],
          belong: values[1],
          tags: [],
        };
      })
    );
  };

  if (!players) {
    return null;
  }

  return (
    <Box pt={5}>
      <H2>プレイヤーの読み込み</H2>
      <Flex py={5} gap={3} alignItems="center">
        <Input type="file" accept=".csv" onChange={handleOnChange} p={0} />
        <Button
          size="sm"
          colorScheme="green"
          disabled={players.length === 0}
          onClick={() => setDrawerOpen(true)}
        >
          プレビュー
        </Button>
      </Flex>
      <Drawer
        isOpen={drawerOpen}
        placement="right"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>プレイヤー一覧</DrawerHeader>
          <DrawerBody>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>プレイヤー名</Th>
                    <Th>所属</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {players.map((player, i) => (
                    <Tr key={i}>
                      <Td>{i + 1}</Td>
                      <Td>{player.name}</Td>
                      <Td>{player.belong}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default LoadPlayer;
