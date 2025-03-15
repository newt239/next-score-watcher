"use client";

import { List, Table } from "@mantine/core";

const RecommendedEnvironment = () => {
  return (
    <Table highlightOnHover mb="xl">
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>OS</Table.Th>
          <Table.Td>
            <List>
              <List.Item>Windows 11 最新版</List.Item>
              <List.Item>macOS 最新版</List.Item>
            </List>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Webブラウザ</Table.Th>
          <Table.Td>
            <List>
              <List.Item>Google Chrome 最新版</List.Item>
            </List>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>解像度</Table.Th>
          <Table.Td>
            <List>
              <List.Item>1280 x 720 以上</List.Item>
            </List>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td colSpan={2}>
            これ以外の環境で利用する際に発生する不具合については、サポートの対象外となる場合があります。
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};

export default RecommendedEnvironment;
