import { Box, Flex, Modal } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import classes from "./WinModal.module.css";

import XIntentButton from "@/app/_components/XIntentButton/XIntentButton";

type Props = {
  onClose: () => void;
  winTroughPlayer: { name: string; text: string };
  roundName: string;
};

const WinModal: React.FC<Props> = ({ onClose, winTroughPlayer }) => {
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
        <Flex justify="center" pt="xl">
          <XIntentButton
            text={`${winTroughPlayer.name}さんが勝ち抜けました🎉`}
            url="https://score-watcher.com"
            hashtags={["ScoreWatcher"]}
          />
        </Flex>
      </Box>
    </Modal>
  );
};

export default WinModal;
