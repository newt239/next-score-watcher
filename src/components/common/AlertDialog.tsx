import { useRef } from "react";

import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  AlertDialog as ChakraAlertDialog,
} from "@chakra-ui/react";

type AlertDialogProps = {
  title: string;
  body: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  body,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const cancelRef = useRef(null);

  return (
    <ChakraAlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose} ref={cancelRef}>
              やめる
            </Button>
            <Button colorScheme="red" ml={3} onClick={onConfirm}>
              実行する
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  );
};

export default AlertDialog;
