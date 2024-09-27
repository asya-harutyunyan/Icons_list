import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import { IconService } from '../../services/icons.service';

type DeleteIconModalProps = {
  refetch: () => void;
  closeDeleteModal: () => void;
  isDeleteModalOpen: boolean;
  selectedIconId: string;
};

const DeleteIconModal: FC<DeleteIconModalProps> = ({
  refetch,
  isDeleteModalOpen,
  closeDeleteModal,
  selectedIconId,
}) => {
  const { mutate: deleteSelectedIcon } = useMutation({
    mutationFn: IconService.deleteIcon,
    onSuccess: () => {
      refetch();
      closeDeleteModal();
    },
  });

  return (
    <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to delete this icon?</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" gap="15px">
          <Button colorScheme="gray" mr={3} onClick={closeDeleteModal}>
            Close
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              deleteSelectedIcon(selectedIconId);
            }}
          >
            Delete
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteIconModal;
