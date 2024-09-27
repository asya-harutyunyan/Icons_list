import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IconService } from '../../services/icons.service';
import { FormValues, Icon } from '../../types';

type AddNewIconProps = {
  iconToEditId: string;
  isAddEditModalOpen: boolean;
  closeAddEditModal: () => void;
};

const AddEditIconModal: FC<AddNewIconProps> = ({
  isAddEditModalOpen,
  closeAddEditModal,
  iconToEditId,
}) => {
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      id: '',
      name: '',
      svg: null,
      color: '#000000',
    },
  });
  const [selectedFileName, setSelectedFileName] = useState('');
  const { data: iconsData, refetch } = useQuery<Icon[]>({
    queryKey: ['icons-list'],
    queryFn: IconService.getAllIcons,
  });

  const iconToUpdate = iconsData?.find((icon) => icon.id === iconToEditId);

  const { mutate } = useMutation({
    mutationFn: IconService.addIcon,
    onSuccess: () => {
      refetch();
      closeAddEditModal();
    },
  });
  const { mutate: updateIcon } = useMutation({
    mutationFn: IconService.updateIcon,
    onSuccess: () => {
      refetch();
      closeAddEditModal();
    },
  });

  useEffect(() => {
    if (iconToUpdate) {
      setValue('id', iconToUpdate.id);
      setValue('name', iconToUpdate.name);
      setValue('color', iconToUpdate.color);
      const svgBlob = new Blob([iconToUpdate.svg], { type: 'image/svg+xml' });
      const svgFile = new File([svgBlob], `${iconToUpdate.name}.svg`, {
        type: 'image/svg+xml',
      });
      setValue('svg', svgFile);
      setSelectedFileName(`${iconToUpdate.name}.svg`);
    } else {
      reset();
      setSelectedFileName('');
    }
  }, [iconToUpdate, reset, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      let svgData = reader.result as string;

      if (svgData.startsWith('data:image/svg+xml;base64,')) {
        const base64Content = svgData.split(',')[1];
        const decodedSvg = atob(base64Content);
        svgData = decodedSvg;
      }

      let coloredSvgData = svgData;

      if (coloredSvgData.includes('fill="')) {
        coloredSvgData = coloredSvgData.replace(
          /fill=".*?"/g,
          `fill="${data.color}"`
        );
      } else if (coloredSvgData.includes('stroke="')) {
        coloredSvgData = coloredSvgData.replace(
          /<svg /,
          `<svg stroke="${data.color}" `
        );
      }
      const iconData: Icon = {
        id: iconToEditId ? iconToEditId : uuidv4(),
        name: data.name,
        svg: coloredSvgData,
        color: data.color,
      };

      if (iconToEditId) {
        updateIcon({ iconData, id: iconToEditId });
      } else {
        mutate(iconData);
      }
      reset();
    };
    if (data.svg) {
      reader.readAsText(data.svg);
    }
  };

  return (
    <Modal
      isOpen={isAddEditModalOpen}
      onClose={() => {
        closeAddEditModal();
        reset();
        setSelectedFileName('');
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody m="20px 0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection="column" gap="25px">
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Name" />}
              />
              <Box>
                <Controller
                  name="svg"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Input
                      type="file"
                      accept=".svg"
                      onChange={(e) => {
                        onChange(e.target.files?.[0] || null);
                      }}
                    />
                  )}
                />
                <Text>{selectedFileName || ''}</Text>
              </Box>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <Input
                    type="color"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Button
                type="submit"
                bg="#6CB29E"
                color="#000"
                _hover={{
                  bg: '#6AA190',
                  color: '#000',
                }}
              >
                Submit
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddEditIconModal;
