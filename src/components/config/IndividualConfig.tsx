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
import { AdjustmentsHorizontal, DeviceFloppy } from "tabler-icons-react";

import db, { GameDBPlayerProps, RuleNames } from "#/utils/db";

type InitialPointConfigModalProps = {
  onClose: () => void;
  isOpen: boolean;
  onClick: () => void;
  game_id: string;
  rule_name: RuleNames;
  players: GameDBPlayerProps[];
  index: number;
  correct: boolean;
  wrong: boolean;
  disabled?: boolean;
};

const IndividualConfig: React.FC<InitialPointConfigModalProps> = ({
  onClose,
  isOpen,
  onClick,
  game_id,
  rule_name,
  players,
  index,
  correct,
  wrong,
  disabled,
}) => {
  if (!correct && !wrong) return null;

  return (
    <>
      <IconButton
        onClick={onClick}
        size="xs"
        aria-label="初期値の変更"
        icon={<AdjustmentsHorizontal />}
        disabled={disabled}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>個人設定: {players[index].name}</ModalHeader>
          <ModalCloseButton aria-label="閉じる" />
          <ModalBody>
            {correct && (
              <FormControl pt={3}>
                <FormLabel>初期正答数</FormLabel>
                <NumberInput
                  value={players[index].initial_correct}
                  onChange={(s, n) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? { ...gamePlayer, initial_correct: n }
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
                  onChange={(s, n) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? { ...gamePlayer, initial_wrong: n }
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
            {rule_name === "various-fluctuations" && (
              <FormControl pt={3}>
                <FormLabel>N</FormLabel>
                <NumberInput
                  value={players[index].base_correct_point}
                  min={3}
                  onChange={(s, n) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? {
                              ...gamePlayer,
                              base_correct_point: n,
                              base_wrong_point: Math.min(-n * (n - 2), -3),
                            }
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
            <Button
              colorScheme="blue"
              leftIcon={<DeviceFloppy />}
              onClick={onClose}
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IndividualConfig;
