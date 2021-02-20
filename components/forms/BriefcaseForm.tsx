import React, { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Input,
  FormControl,
  Spinner,
  Heading,
  InputGroup,
  IconButton,
  InputLeftElement,
  InputRightElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SimpleGrid,
  Button,
  useToast,
} from "@chakra-ui/react";
import api from "utils/api";
import WarningDialog from "components/WarningDialog";
import { BiSearch, BiPlus, BiX, BiTrash } from "react-icons/bi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BriefcasePDF from "components/BriefcasePDF";

interface Props {
  briefcaseId?: string | null;
  onClose(): void;
  refresh(): void;
}

interface Jewel {
  jewelId: number;
  name: string;
  line: string;
  type: string;
  price: number;
  purchase_price: number;
}

const BriefcaseForm = ({ briefcaseId, onClose, refresh }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [searchList, setSearchList] = useState<Jewel[]>([]);
  const [briefcaseName, setBriefcaseName] = useState<string>("");
  const [jewelList, setJewelList] = useState<Jewel[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingBriefcase, setLoadingBriefcase] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    setTotal(jewelList.reduce((amount, item) => item.price + amount, 0));
  }, [jewelList, total]);

  useEffect(() => {
    fetchBriefcase();
  }, []);

  useEffect(() => {
    fetchJewels();
  }, [search]);

  const fetchJewels = async () => {
    setLoading(true);
    try {
      const jewelResponse = await api.get(
        `/api/jewel?page=${0}&jewelId=${search}`
      );
      setSearchList(jewelResponse.data.jewels);
    } catch (error) {}
    setLoading(false);
  };

  const fetchBriefcase = async () => {
    if (briefcaseId) {
      try {
        const briefcaseResponse = await api.get(
          `/api/briefcase/${briefcaseId}`
        );
        setJewelList(briefcaseResponse.data.data.briefcase.jewels);
        setBriefcaseName(briefcaseResponse.data.data.briefcase.briefcase_name);
      } catch (error) {}
    }
    setLoadingBriefcase(false);
  };

  const handleAddJewel = useCallback(
    (jewel) => {
      if (!jewelList.some((item) => item.jewelId === jewel.jewelId)) {
        setJewelList([...jewelList, { ...jewel }]);
      }
    },
    [jewelList]
  );
  const handleRemoveJewel = useCallback(
    (jewel) => {
      setJewelList(jewelList.filter((item) => item.jewelId !== jewel.jewelId));
    },
    [jewelList]
  );

  const handleSave = async () => {
    if (briefcaseName) {
      setLoading(true);
      try {
        await api.post(`/api/briefcase`, {
          briefcase_name: briefcaseName,
          jewels: jewelList.map((jw) => ({ jewelId: jw.jewelId })),
          total_value: total,
        });
        toast({
          title: "Maleta salva com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refresh();
        onClose();
      } catch (error) {
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    } else {
      toast({
        title: "Insira um nome para a maleta!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleEdit = async () => {
    if (briefcaseName && briefcaseId) {
      setLoading(true);
      try {
        await api.patch(`/api/briefcase/${briefcaseId}`, {
          briefcase_name: briefcaseName,
          jewels: jewelList.map((jw) => ({ jewelId: jw.jewelId })),
          total_value: total,
        });
        toast({
          title: "Maleta salva com sucesso!",
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
    } else {
      toast({
        title: "Insira um nome para a maleta!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleDelete = async () => {
    if (briefcaseId) {
      setLoading(true);
      try {
        await api.delete(`/api/briefcase/${briefcaseId}`);
        toast({
          title: "Maleta deletada",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        refresh();
        onClose();
      } catch (error) {
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    }
  };

  return loadingBriefcase ? (
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
    <Flex height="auto" flexDirection="row" pb="4">
      <Flex flex="1" height="100%" flexDirection="column" px="4">
        <FormControl id="nome" isRequired>
          <Input
            placeholder="Nome da Maleta"
            autoComplete="off"
            value={briefcaseName}
            onChange={(e) => setBriefcaseName(e.target.value)}
          />
        </FormControl>
        <Flex height="auto" flexDirection="column" py="4">
          <Heading as="h4" size="md">
            Jóias Selecionadas
          </Heading>
          <Flex
            height="50vh"
            flexDirection="column"
            py="2"
            overflowY="scroll"
            overflowX="hidden"
          >
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Nome</Th>
                  <Th isNumeric>Preço Venda</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {jewelList.map((jewel) => (
                  <Tr key={jewel.jewelId}>
                    <Td>{jewel.jewelId}</Td>
                    <Td>{jewel.name}</Td>
                    <Td isNumeric>R${(jewel.price / 100).toFixed(2)}</Td>
                    <Td isNumeric>
                      <IconButton
                        aria-label="clear filters"
                        colorScheme="red"
                        fontSize="20px"
                        onClick={() => handleRemoveJewel(jewel)}
                        icon={<BiTrash color="gray.300" />}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
        <Flex flexDirection="row">
          {!!briefcaseId || (
            <SimpleGrid columns={1} spacing={4} marginTop="4">
              <Button
                isLoading={loading}
                colorScheme="green"
                onClick={handleSave}
              >
                Cadastrar
              </Button>
            </SimpleGrid>
          )}
          {!!briefcaseId && (
            <SimpleGrid columns={3} spacing={4} marginTop="4">
              <Button
                isLoading={loading}
                colorScheme="blue"
                onClick={handleEdit}
              >
                Salvar alterações
              </Button>
              <Button
                isLoading={loading}
                colorScheme="red"
                onClick={() => setOpenDialog(!openDialog)}
              >
                Deletar
              </Button>

              {loadingBriefcase || (
                <PDFDownloadLink
                  document={
                    <BriefcasePDF
                      briefcaseName={briefcaseName}
                      jewelList={jewelList}
                      total={total}
                    />
                  }
                  fileName={`${briefcaseName}_maleta.pdf`}
                  style={{
                    textDecoration: "none",
                    padding: "8px",
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    backgroundColor: "#6B46C1",
                    borderRadius: "8px",
                  }}
                >
                  {({ loading }) =>
                    loading ? "Carregando..." : "Download PDF"
                  }
                </PDFDownloadLink>
              )}
            </SimpleGrid>
          )}
        </Flex>
      </Flex>
      <Flex flex="1" height="100%" flexDirection="column" px="4">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<BiSearch color="gray.300" />}
          />

          <Input
            value={search}
            placeholder="Pesquisar por Código"
            onChange={(e) => {
              setSearch(e.target.value.replace(/\D/g, ""));
            }}
          />
          {search && (
            <InputRightElement
              children={
                <IconButton
                  variant="outline"
                  aria-label="clear filters"
                  fontSize="20px"
                  onClick={() => setSearch("")}
                  icon={<BiX color="gray.300" />}
                />
              }
            />
          )}
        </InputGroup>
        <Flex
          flexDirection="column"
          my="4"
          overflowY="scroll"
          overflowX="hidden"
          height="54vh"
        >
          {loading ? (
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
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
                  <Th isNumeric>Preço Venda</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {searchList.map((jewel) => (
                  <Tr key={jewel.jewelId}>
                    <Td>{jewel.jewelId}</Td>
                    <Td>{jewel.name}</Td>
                    <Td isNumeric>R${(jewel.price / 100).toFixed(2)}</Td>
                    <Td isNumeric>
                      <IconButton
                        aria-label="add jewel"
                        colorScheme="green"
                        fontSize="20px"
                        onClick={() => handleAddJewel(jewel)}
                        icon={<BiPlus color="gray.300" />}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Flex>
        <Flex flexDirection="row" w="100%" justify="flex-end" py="4">
          <Heading as="h4" size="md">
            Total: R${(total / 100).toFixed(2)}
          </Heading>
        </Flex>
      </Flex>
      <WarningDialog
        header="Deletar Maleta?"
        body="Tem certeza? Esta ação é irreversível."
        confirmTitle="Deletar"
        onConfirm={() => handleDelete()}
        show={openDialog}
        setShow={setOpenDialog}
      />
    </Flex>
  );
};

export default BriefcaseForm;
