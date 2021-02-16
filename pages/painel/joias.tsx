import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import WhiteBox from "components/WhiteBox";
import ModalForm from "components/ModalForm";
import JewelForm from "components/forms/JewelForm";
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  InputRightElement,
  Spacer,
  TableCaption,
  IconButton,
  Button,
} from "@chakra-ui/react";
import api from "utils/api";
import lines from "utils/jewels/lines";
import types from "utils/jewels/types";
import { BiSearch, BiPlus, BiX } from "react-icons/bi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
interface Jewel {
  jewelId: number;
  name: string;
  line: string;
  type: string;
  price: number;
}
interface Action {
  action: string;
}
const Joias = () => {
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [editJewel, setEditJewel] = useState<Jewel | null>(null);

  useEffect(() => {
    fetchJewels();
  }, [pagination, filter]);

  const fetchJewels = async () => {
    setLoading(true);
    try {
      const jewelResponse = await api.get(
        `/api/jewel?page=${pagination}&jewelId=${filter}`
      );
      setJewels(jewelResponse.data.jewels);
    } catch (error) {}
    setLoading(false);
  };

  const handlePageChanger = ({ action }: Action) => {
    switch (action) {
      case "next":
        setPagination(pagination + 1);
        break;
      case "prev":
        setPagination(pagination - 1);
        break;
      default:
        break;
    }
  };

  const printJewelLine = (name: string) => {
    const line = lines.find((item) => item.value === name);
    return line ? line.title : "Linha não encontrada";
  };
  const printJewelType = (name: string) => {
    const type = types.find((item) => item.value === name);
    return type ? type.title : "Tipo não encontrado";
  };

  return (
    <Layout title="Jóias | Enalta Jóias">
      <WhiteBox>
        <Flex flexDirection="column" width="100%" height="100%">
          <Flex flexDirection="row">
            <Flex>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<BiSearch color="gray.300" />}
                />

                <Input
                  value={filter}
                  placeholder="Pesquisar por Código"
                  onChange={(e) => setFilter(e.target.value.replace(/\D/g, ""))}
                />
                {filter && (
                  <InputRightElement
                    children={
                      <IconButton
                        variant="outline"
                        aria-label="clear filters"
                        fontSize="20px"
                        onClick={() => setFilter("")}
                        icon={<BiX color="gray.300" />}
                      />
                    }
                  />
                )}
              </InputGroup>
            </Flex>
            <Spacer />
            <Flex>
              <Button
                leftIcon={<BiPlus />}
                colorScheme="yellow"
                onClick={() => setShowModal(true)}
              >
                Cadastrar Jóia
              </Button>
            </Flex>
          </Flex>
          {loading ? (
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              height="100%"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          ) : (
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Nome</Th>
                  <Th>Linha</Th>
                  <Th>Tipo</Th>
                  <Th isNumeric>Preço</Th>
                </Tr>
              </Thead>
              <Tbody>
                {jewels.map((jewel) => (
                  <Tr key={jewel.jewelId}>
                    <Td
                      onClick={() => {
                        setEditJewel({ ...jewel });
                        setShowModal(true);
                      }}
                      cursor="pointer"
                    >
                      {jewel.jewelId}
                    </Td>
                    <Td
                      onClick={() => {
                        setEditJewel({ ...jewel });
                        setShowModal(true);
                      }}
                      cursor="pointer"
                    >
                      {jewel.name}
                    </Td>
                    <Td
                      onClick={() => {
                        setEditJewel({ ...jewel });
                        setShowModal(true);
                      }}
                      cursor="pointer"
                    >
                      {printJewelLine(jewel.line)}
                    </Td>
                    <Td
                      onClick={() => {
                        setEditJewel({ ...jewel });
                        setShowModal(true);
                      }}
                      cursor="pointer"
                    >
                      {printJewelType(jewel.type)}
                    </Td>
                    <Td
                      onClick={() => {
                        setEditJewel({ ...jewel });
                        setShowModal(true);
                      }}
                      cursor="pointer"
                      isNumeric
                    >
                      R${(jewel.price / 100).toFixed(2)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <TableCaption>
                <Flex flexDirection="row" align="center">
                  <IconButton
                    onClick={() => handlePageChanger({ action: "prev" })}
                    colorScheme="yellow"
                    size="sm"
                    aria-label="prev page"
                    disabled={pagination + 1 <= 1}
                    icon={<BsChevronLeft />}
                  />
                  <Spacer />
                  <Text>{pagination + 1}</Text>
                  <Spacer />
                  <IconButton
                    onClick={() => handlePageChanger({ action: "next" })}
                    colorScheme="yellow"
                    size="sm"
                    aria-label="next page"
                    disabled={jewels.length < 9 ? true : false}
                    icon={<BsChevronRight />}
                  />
                </Flex>
              </TableCaption>
            </Table>
          )}
        </Flex>
        <ModalForm
          title="Cadastrar Jóia"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditJewel(null);
          }}
        >
          <JewelForm
            onClose={() => {
              setShowModal(false);
              setEditJewel(null);
            }}
            value={editJewel}
            refresh={fetchJewels}
          />
        </ModalForm>
      </WhiteBox>
    </Layout>
  );
};

export default Joias;
