import {
  Modal,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StatLabel,
  Stat,
  StatHelpText,
  StatNumber,
  Center,
  ModalCloseButton,
} from "@chakra-ui/react";

type WinModalProps = {
  onClose: () => void;
  winTroughPeople: [string, string][];
  roundName?: string;
};
const WinModal: React.FC<WinModalProps> = ({
  onClose,
  winTroughPeople,
  roundName,
}) => {
  return (
    <Modal isOpen={winTroughPeople.length !== 0} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={10}>
          {winTroughPeople.map((player) => (
            <Stat key={player[0]} sx={{ textAlign: "center" }}>
              <StatLabel sx={{ fontSize: "1.5rem" }}>{player[1]}</StatLabel>
              <StatNumber sx={{ fontSize: "2.5rem" }}>{player[0]}</StatNumber>
              {roundName && <StatHelpText>{roundName}</StatHelpText>}
            </Stat>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WinModal;
