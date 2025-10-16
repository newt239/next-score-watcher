"use client";

import { Table } from "@mantine/core";

import CurrentVersion from "./CurrentVersion";

import Link from "@/app/_components/Link";

const AppInfo = () => {
  return (
    <Table highlightOnHover mb="xl">
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>バージョン</Table.Th>
          <Table.Td>
            <CurrentVersion />
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>開発者</Table.Th>
          <Table.Td>
            <Link href="https://twitter.com/newt239">newt239</Link>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>リポジトリ</Table.Th>
          <Table.Td>
            <Link href="https://github.com/newt239/next-score-watcher">
              newt239/next-score-watcher
            </Link>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};

export default AppInfo;
