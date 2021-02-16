import React, { useState, FormEvent } from "react";
import {
  Flex,
  Input,
  Stack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
  Button,
  useToast,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
interface Props {
  value?: Jewel | null;
  onClose(): void;
  refresh(): void;
}
import api from "utils/api";
import lines from "utils/jewels/lines";
import types from "utils/jewels/types";

interface Jewel {
  jewelId: number;
  name: string;
  line: string;
  type: string;
  price: number;
}

const JewelForm = ({ value, onClose, refresh }: Props) => {
  const [jewelId] = useState<number | null>(() => {
    if (value) {
      return value.jewelId;
    } else {
      return null;
    }
  });
  const [name, setName] = useState<string>(() => {
    if (value) {
      return value.name;
    } else {
      return "";
    }
  });
  const [line, setLine] = useState<string>(() => {
    if (value) {
      return value.line;
    } else {
      return "";
    }
  });
  const [type, setType] = useState<string>(() => {
    if (value) {
      return value.type;
    } else {
      return "";
    }
  });
  const [price, setPrice] = useState<string>(() => {
    if (value) {
      return (value.price / 100).toFixed(2).toString();
    } else {
      return "0";
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      await api.post(`/api/jewel`, {
        name,
        line,
        type,
        price: Number(price) * 100,
      });
      refresh();
      onClose();
      toast({
        title: "Jóia Salva com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (value) {
        await api.delete(`/api/jewel/${value?.jewelId}`);
        refresh();
        onClose();
        toast({
          title: "Jóia removida.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Jóia inválida",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };
  const handleEdit = async () => {
    setLoading(true);
    try {
      if (value) {
        await api.patch(`/api/jewel/${value?.jewelId}`, {
          name,
          line,
          type,
          price: Number(price) * 100,
        });
        refresh();
        onClose();
        toast({
          title: "Jóia atualizada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Jóia inválida",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Flex height="auto" flexDirection="column">
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {jewelId && (
            <FormControl id="jewelId" isDisabled>
              <FormLabel>Código</FormLabel>
              <Input value={jewelId} />
            </FormControl>
          )}
          <FormControl id="nome" isRequired>
            <FormLabel>Nome da Jóia</FormLabel>
            <Input
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="linha" isRequired>
            <FormLabel>Linha</FormLabel>
            <Select
              placeholder="Selecione uma linha"
              value={line}
              onChange={(e) => setLine(e.target.value)}
            >
              {lines.map((line_option) => (
                <option key={line_option.value} value={line_option.value}>
                  {line_option.title}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="type" isRequired>
            <FormLabel>Tipo</FormLabel>
            <Select
              placeholder="Selecione um tipo"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {types.map((type_option) => (
                <option key={type_option.value} value={type_option.value}>
                  {type_option.title}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="price" isRequired>
            <FormLabel>Preço (R$)</FormLabel>
            <NumberInput
              defaultValue={0}
              precision={2}
              step={0.2}
              min={0}
              value={price}
              onChange={(value) => setPrice(value.replace(/^\R$/, ""))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>
              Utilize "." para separar decimais ex: R$1.50
            </FormHelperText>
          </FormControl>
        </Stack>

        {!!value || (
          <SimpleGrid columns={1} spacing={4} marginTop="4">
            <Button isLoading={loading} type="submit" colorScheme="green">
              Cadastrar
            </Button>
          </SimpleGrid>
        )}
        {!!value && (
          <SimpleGrid columns={2} spacing={4} marginTop="4">
            <Button
              isLoading={loading}
              colorScheme="red"
              onClick={() => handleDelete()}
            >
              Deletar
            </Button>
            <Button
              isLoading={loading}
              colorScheme="blue"
              onClick={() => handleEdit()}
            >
              Salvar alterações
            </Button>
          </SimpleGrid>
        )}
      </form>
    </Flex>
  );
};

export default JewelForm;
