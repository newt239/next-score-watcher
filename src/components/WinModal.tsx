import {
  Modal,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

type WinModalProps = {
  onClose: () => void;
  winTroughPeople: [string, string][];
};
const WinModal: React.FC<WinModalProps> = ({ onClose, winTroughPeople }) => {
  return (
    <Modal isOpen={winTroughPeople.length !== 0} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalBody>
          {winTroughPeople.map((player) => (
            <div key={player[0]} style={{ display: "flex" }}>
              <div>{player[1]}</div>: <div>{player[0]}</div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            閉じる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WinModal;
