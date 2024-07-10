import { Box, Modal } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import classes from "./WinModal.module.css";

type Props = {
  onClose: () => void;
  winTroughPlayer: { name: string; text: string };
  roundName: string;
};

const WinModal: React.FC<Props> = ({ onClose, winTroughPlayer, roundName }) => {
  const showWinthroughPopup = useLocalStorage({
    key: "scorew_show_winthrough_popup",
    defaultValue: true,
  });
  if (winTroughPlayer.name === "") return null;

  return (
    <Modal
      opened={showWinthroughPopup && winTroughPlayer.name !== ""}
      withCloseButton={false}
      onClose={onClose}
      size="auto"
      centered
      classNames={{ body: classes.body }}
    >
      <Box className={classes.content}>
        <Box className={classes.text}>{winTroughPlayer.text}</Box>
        <Box className={classes.name}> {winTroughPlayer.name}</Box>
      </Box>
    </Modal>
  );
};

export default WinModal;
