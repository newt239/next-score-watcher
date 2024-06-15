import { Drawer } from "@mantine/core";

import Preferences from "@/app/_components/Preferences";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const PreferenceDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      title="表示設定"
      position="right"
      offset={10}
      radius="md"
    >
      <Preferences />
    </Drawer>
  );
};

export default PreferenceDrawer;
