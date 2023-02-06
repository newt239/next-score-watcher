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
  winTroughPeople: [string, string][];
  roundName?: string;
};

const WinModal: React.FC<WinModalProps> = ({
  onClose,
  winTroughPeople,
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
  }, [winTroughPeople.length]);

  return (
    <Modal
      isOpen={
        getConfig("scorewatcher-winthrough-popup") &&
        winTroughPeople.length !== 0
      }
      onClose={onClose}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={10}>
          {winTroughPeople.map((player) => (
            <Stat key={player[0]} sx={{ textAlign: "center" }} onClick={reward}>
              <StatLabel sx={{ fontSize: "1.5rem" }}>
                <span id="reward" />
                {player[1]}
              </StatLabel>
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
