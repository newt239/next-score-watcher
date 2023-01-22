import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Button,
  ModalFooter,
  IconButton,
} from "@chakra-ui/react";
import { Settings } from "tabler-icons-react";

import db, { GameDBPlayerProps } from "#/utils/db";

type InitialPointConfigModalProps = {
  onClose: () => void;
  isOpen: boolean;
  onClick: () => void;
  game_id: string;
  players: GameDBPlayerProps[];
  index: number;
  correct: boolean;
  wrong: boolean;
};
const InitialPointConfig: React.FC<InitialPointConfigModalProps> = ({
  onClose,
  isOpen,
  onClick,
  game_id,
  players,
  index,
  correct,
  wrong,
}) => {
  if (!correct && !wrong) return null;
  return (
    <>
      <IconButton
        onClick={onClick}
        variant="ghost"
        size="xs"
        aria-label="初期値の変更"
        icon={<Settings />}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{players[index].name}の初期ポイント</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {correct && (
              <FormControl pt={3}>
                <FormLabel>初期正答数</FormLabel>
                <NumberInput
                  value={players[index].initial_correct}
                  onChange={(s) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? { ...gamePlayer, initial_correct: s }
                          : gamePlayer
                      ),
                    });
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
            {wrong && (
              <FormControl pt={3}>
                <FormLabel>初期誤答数</FormLabel>
                <NumberInput
                  value={players[index].initial_wrong}
                  onChange={(s) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? { ...gamePlayer, initial_wrong: s }
                          : gamePlayer
                      ),
                    });
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InitialPointConfig;
