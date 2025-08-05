import { Box, Drawer, Kbd, Table, Tabs } from "@mantine/core";

import Preferences from "@/app/(default)/option/_components/Preferences";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
};

const PreferenceDrawer: React.FC<Props> = ({ isOpen, onClose, userId }) => {
  const commands = [
    {
      key: "1",
      description: "左から1番目のプレイヤーの正答",
    },
    {
      key: "2",
      description: "左から2番目のプレイヤーの正答",
    },
    {
      key: "0",
      description: "左から10番目のプレイヤーの正答",
    },
    {
      key: "<",
      description: "一つ戻す",
    },
    {
      key: ">",
      description: "スルー",
    },
  ];

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      title="表示設定"
      position="right"
      offset={10}
      radius="md"
    >
      <Tabs variant="outline" defaultValue="preferences">
        <Tabs.List grow>
          <Tabs.Tab value="preferences">表示設定</Tabs.Tab>
          <Tabs.Tab value="shortcuts">ショートカット</Tabs.Tab>
        </Tabs.List>
        <Box py="lg">
          <Tabs.Panel value="preferences">
            <Preferences userId={userId} />
          </Tabs.Panel>
          <Tabs.Panel value="shortcuts">
            <Table highlightOnHover>
              {commands.map((command, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Kbd>{command.key}</Kbd>
                  </Table.Td>
                  <Table.Td>{command.description}</Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </Tabs.Panel>
        </Box>
      </Tabs>
    </Drawer>
  );
};

export default PreferenceDrawer;
