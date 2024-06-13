import { Modal } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

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
      onClose={onClose}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>Congratulations!</Modal.Header>
        <Modal.CloseButton />
        <Modal.Body py={10}>
          {winTroughPlayer.text}
          {winTroughPlayer.name}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default WinModal;
