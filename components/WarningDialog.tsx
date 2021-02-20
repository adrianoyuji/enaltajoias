import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

interface WarningProps {
  header: string;
  body: string;
  confirmTitle: string;
  onConfirm(): void;
  show: boolean;
  setShow(state: boolean): void;
}

const WarningDialog = ({
  header,
  body,
  confirmTitle,
  onConfirm,
  show,
  setShow,
}: WarningProps) => {
  const onClose = () => setShow(false);
  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        isOpen={show}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={onConfirm} ml={3}>
                {confirmTitle}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default WarningDialog;
