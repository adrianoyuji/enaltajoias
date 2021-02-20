import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import WhiteBox from "components/WhiteBox";
import ModalForm from "components/ModalForm";
import BriefcaseForm from "components/forms/BriefcaseForm";

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

import { BiSearch, BiPlus, BiX } from "react-icons/bi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface Briefcase {
  _id: string;
  jewels: Jewel[];
  briefcase_name: string;
  jewel_quantity: number;
  total_value: number;
}

interface Jewel {
  jewelId: number;
  name: string;
  line: string;
  type: string;
  price: number;
  purchase_price: number;
}

interface Action {
  action: string;
}
const Maletas = () => {
  const [briefcases, setBriefcases] = useState<Briefcase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [editBriefcase, setEditBriefcase] = useState<string | null>(null);

  useEffect(() => {
    fetchBriefcases();
  }, [pagination, filter]);

  const fetchBriefcases = async () => {
    setLoading(true);
    try {
      const briefcaseResponse = await api.get(
        `/api/briefcase?page=${pagination}&briefcaseName=${filter}`
      );
      setBriefcases(briefcaseResponse.data.briefcases);
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

  return (
    <Layout title="Maletas | Enalta Jóias">
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
                  placeholder="Pesquisar por Nome"
                  onChange={(e) => {
                    setFilter(e.target.value.replace(/\D/g, ""));
                    setPagination(0);
                  }}
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
                Cadastrar Maleta
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
                  <Th>ID</Th>
                  <Th>Nome</Th>
                  <Th>Qtde Jóias</Th>
                  <Th isNumeric>Preço Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {briefcases.map((briefcase) => (
                  <Tr key={briefcase._id}>
                    <Td
                      onClick={() => {
                        setEditBriefcase(briefcase._id);
                        setShowModal(true);
                      }}
                      cursor="pointer"
                    >
                      {briefcase._id}
                    </Td>
                    <Td
                      onClick={() => {
                        setEditBriefcase(briefcase._id);
                        setShowModal(true);
                      }}
                      cursor="pointer"
                    >
                      {briefcase.briefcase_name}
                    </Td>

                    <Td
                      onClick={() => {
                        setEditBriefcase(briefcase._id);
                        setShowModal(true);
                      }}
                      cursor="pointer"
                    >
                      {briefcase.jewel_quantity}
                    </Td>

                    <Td
                      onClick={() => {
                        setEditBriefcase(briefcase._id);
                        setShowModal(true);
                      }}
                      cursor="pointer"
                      isNumeric
                    >
                      R${(briefcase.total_value / 100).toFixed(2)}
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
                    disabled={briefcases.length < 9 ? true : false}
                    icon={<BsChevronRight />}
                  />
                </Flex>
              </TableCaption>
            </Table>
          )}
        </Flex>
        <ModalForm
          title="Cadastrar Maleta"
          size="6xl"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditBriefcase(null);
          }}
        >
          <BriefcaseForm
            onClose={() => {
              setShowModal(false);
              setEditBriefcase(null);
            }}
            briefcaseId={editBriefcase}
            refresh={fetchBriefcases}
          />
        </ModalForm>
      </WhiteBox>
    </Layout>
  );
};

export default Maletas;
