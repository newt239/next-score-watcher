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
          <Stat key={winTroughPlayer.text} sx={{ textAlign: "center" }}>
            <StatLabel sx={{ fontSize: "1.5rem" }}>
              {winTroughPlayer.text}
            </StatLabel>
            <StatNumber sx={{ fontSize: "2.5rem" }}>
              {winTroughPlayer.name}
            </StatNumber>
            <StatHelpText>{roundName}</StatHelpText>
          </Stat>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default WinModal;
