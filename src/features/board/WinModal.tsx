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
import { useAtomValue } from "jotai";

import { showWinthroughPopupAtom } from "#/utils/jotai";

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
  const showWinthroughPopup = useAtomValue(showWinthroughPopupAtom);

  if (winTroughPlayer.name === "") return null;

  return (
    <Modal
      isCentered
      isOpen={showWinthroughPopup && winTroughPlayer.name !== ""}
      onClose={onClose}
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={10}>
          <Stat key={winTroughPlayer.text} className={css({ textAlign: "center" }}>
            <StatLabel className={css({ fontSize: "1.5rem" }}>
              {winTroughPlayer.text}
            </StatLabel>
            <StatNumber className={css({ fontSize: "2.5rem" }}>
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
