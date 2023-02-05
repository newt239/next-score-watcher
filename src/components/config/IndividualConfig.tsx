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

import db, { GameDBPlayerProps, GameDBProps, RuleNames } from "#/utils/db";

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
  console.log(players[index]);
  return (
    <>
      <IconButton
        onClick={onClick}
        variant="ghost"
        size="xs"
        aria-label="初期値の変更"
        icon={<Settings />}
        disabled={disabled}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>個人設定: {players[index].name}</ModalHeader>
          <ModalCloseButton />
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
                  min={2}
                  onChange={(s, n) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? {
                              ...gamePlayer,
                              base_correct_point: n,
                              base_wrong_point: -n * (n - 2),
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
            <Button onClick={onClose}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IndividualConfig;
