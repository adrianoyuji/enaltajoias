import React, { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  size?: string;
  onClose(): void;
  title: string;
}

const ModalForm = ({
  children,
  isOpen,
  onClose,
  title,
  size = "md",
}: Props) => {
  return (
    <>
      <Modal size={size} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalForm;
