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
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  useToast,
  Tr,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import db, { PlayerDBProps } from "#/utils/db";

const LoadPlayer: React.FC = () => {
  const players = useLiveQuery(() => db.players.toArray(), []);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const toast = useToast();

  const fileReader = new FileReader();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      fileReader.onload = (ev) => {
        const csvOutput = ev.target?.result;
        if (typeof csvOutput === "string") {
          csvFileToArray(csvOutput).then((row) => {
            toast({
              title: "データをインポートしました",
              description: `${files[0].name}から${row}件のプレイヤーデータを読み込みました`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          });
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
    return csvRows.length;
  };

  if (!players) {
    return null;
  }

  return (
    <Box>
      <H3>ファイルから読み込み</H3>
      <Stack>
        <Box py={5}>
          <Input type="file" accept=".csv" onChange={handleOnChange} />
        </Box>
      </Stack>
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
