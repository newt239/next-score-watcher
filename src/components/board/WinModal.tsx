import { useEffect } from "react";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  StatLabel,
  Stat,
  StatHelpText,
  StatNumber,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useReward } from "react-rewards";

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
  const { reward } = useReward("reward", "confetti", {
    elementCount: 100,
    lifetime: 300,
    zIndex: 10,
  });

  useEffect(() => {
    setTimeout(() => {
      reward();
    }, 500);
  }, [winTroughPlayer]);

  if (winTroughPlayer.name === "") return null;

  return (
    <Modal
      isOpen={showWinthroughPopup && winTroughPlayer.name !== ""}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={10}>
          <Stat
            key={winTroughPlayer.text}
            sx={{ textAlign: "center" }}
            onClick={reward}
          >
            <StatLabel sx={{ fontSize: "1.5rem" }}>
              <span id="reward" />
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
