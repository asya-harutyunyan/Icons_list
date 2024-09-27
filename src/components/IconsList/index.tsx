import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { IconService } from '../../services/icons.service';
import {
  Button,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { Icon } from '../../types';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import AddEditIconModal from '../AddEditIconModal';
import DeleteIconModal from '../DeleteIconModal';
import GradientLine from '../ColorsGradient';

const IconsList = () => {
  const [selectedIconId, setSelectedIconId] = useState<string>('');
  const [icons, setIcons] = useState<Icon[]>([]);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isAddEditModalOpen,
    onOpen: openAddEditModal,
    onClose: closeAddEditModal,
  } = useDisclosure();

  const { data: iconsData, refetch } = useQuery<Icon[]>({
    queryKey: ['icons-list'],
    queryFn: IconService.getAllIcons,
  });

  useEffect(() => {
    if (iconsData) {
      setIcons(iconsData);
    }
  }, [iconsData]);

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const reorderedIcons = Array.from(icons);
    const [reorderedItem] = reorderedIcons.splice(result.source.index, 1);
    reorderedIcons.splice(result.destination.index, 0, reorderedItem);
    await Promise.all(icons.map((icon) => IconService.deleteIcon(icon.id)));
    await Promise.all(reorderedIcons.map((icon) => IconService.addIcon(icon)));
    setIcons(reorderedIcons);
  };

  const colorsArray: string[] = [];
  icons?.map((icon) => colorsArray.push(icon.color));

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      pt="50px"
      gap="20px"
      bg="#F5E5F1"
      height="100vh"
    >
      <Heading>Icons List</Heading>
      <Flex flexDirection="column" alignItems="center" gap="15px">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="icons-list" direction="horizontal">
            {(provided) => (
              <Flex
                gap="50px"
                justifyContent="center"
                mt="30px"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {icons.map((icon, index) => (
                  <Draggable key={icon.id} draggableId={icon.id} index={index}>
                    {(provided) => (
                      <Flex
                        gap="15px"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Flex flexDirection="column" alignItems="center">
                          <img
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(
                              icon.svg
                            )}`}
                            alt={icon.name}
                            width="60px"
                            height="60px"
                          />
                          <Heading textAlign="center" fontSize="20px">
                            {icon.name}
                          </Heading>
                        </Flex>
                        <Popover>
                          <PopoverTrigger>
                            <Button width="15px" height="30px">
                              ...
                            </Button>
                          </PopoverTrigger>
                          <Portal>
                            <PopoverContent w="130px" height="110px">
                              <PopoverArrow />
                              <PopoverBody
                                display="flex"
                                gap="8px"
                                flexDirection="column"
                                alignItems="center"
                              >
                                <Button
                                  colorScheme="green"
                                  width="100px"
                                  onClick={() => {
                                    setSelectedIconId(icon.id);
                                    openAddEditModal();
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  colorScheme="red"
                                  width="100px"
                                  onClick={() => {
                                    setSelectedIconId(icon.id);
                                    openDeleteModal();
                                  }}
                                >
                                  Delete
                                </Button>
                              </PopoverBody>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                      </Flex>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <Button onClick={openAddEditModal}>+</Button>
                <AddEditIconModal
                  iconToEditId={selectedIconId}
                  isAddEditModalOpen={isAddEditModalOpen}
                  closeAddEditModal={closeAddEditModal}
                />
              </Flex>
            )}
          </Droppable>
        </DragDropContext>

        <GradientLine colorsArray={colorsArray} />
      </Flex>

      {selectedIconId && (
        <DeleteIconModal
          refetch={refetch}
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          selectedIconId={selectedIconId}
        />
      )}
    </Flex>
  );
};

export default IconsList;
