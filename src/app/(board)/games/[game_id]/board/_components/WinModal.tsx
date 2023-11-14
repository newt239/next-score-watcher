import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

type WinModalProps = {
  onClose: () => void;
  winTroughPlayer: { name: string; text: string };
  roundName: string;
};

const WinModal: React.FC<WinModalProps> = ({
  onClose,
  winTroughPlayer,
  roundName,
}) => {
  if (winTroughPlayer.name === "") return null;

  return (
    <Modal isCentered isOpen={winTroughPlayer.name !== ""} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={10}>
          <Stat key={winTroughPlayer.text} sx={{ textAlign: "center" }}>
            <StatLabel sx={{ fontSize: "1.5rem" }}>
              {winTroughPlayer.text}
            </StatLabel>
            <StatNumber sx={{ fontSize: "2.5rem" }}>
              {winTroughPlayer.name}
            </StatNumber>
            <StatHelpText>{roundName}</StatHelpText>
          </Stat>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WinModal;
