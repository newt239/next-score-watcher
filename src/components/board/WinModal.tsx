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
import { useReward } from "react-rewards";

import { getConfig } from "#/hooks/useBooleanConfig";

type WinModalProps = {
  onClose: () => void;
  winTroughPlayer: { name: string; text: string };
  roundName?: string;
};

const WinModal: React.FC<WinModalProps> = ({
  onClose,
  winTroughPlayer,
  roundName,
}) => {
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
      isOpen={
        getConfig("scorewatcher-winthrough-popup") &&
        winTroughPlayer.name !== ""
      }
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
            {roundName && <StatHelpText>{roundName}</StatHelpText>}
          </Stat>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WinModal;
