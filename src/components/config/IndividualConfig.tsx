import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { AdjustmentsHorizontal, DeviceFloppy } from "tabler-icons-react";

import db from "#/utils/db";
import { GameDBPlayerProps, RuleNames } from "#/utils/types";

type InitialPointConfigModalProps = {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
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
        aria-label="初期値の変更"
        disabled={disabled}
        icon={<AdjustmentsHorizontal />}
        onClick={onClick}
        size="xs"
      />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>個人設定: {players[index].name}</ModalHeader>
          <ModalCloseButton aria-label="閉じる" />
          <ModalBody>
            {correct && (
              <FormControl pt={3}>
                <FormLabel>
                  {rule_name === "variables" ? "初期ポイント" : "初期正答数"}
                </FormLabel>
                <NumberInput
                  onChange={(s, n) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? { ...gamePlayer, initial_correct: n }
                          : gamePlayer
                      ),
                    });
                  }}
                  value={players[index].initial_correct}
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
                  onChange={(s, n) => {
                    db.games.update(game_id, {
                      players: players.map((gamePlayer, pi) =>
                        pi === index
                          ? { ...gamePlayer, initial_wrong: n }
                          : gamePlayer
                      ),
                    });
                  }}
                  value={players[index].initial_wrong}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
            {rule_name === "variables" && (
              <FormControl pt={3}>
                <FormLabel>N</FormLabel>
                <NumberInput
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
                  value={players[index].base_correct_point}
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
