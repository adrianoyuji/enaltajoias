import React, { useState, FormEvent } from "react";
import Layout from "../components/Layout";
import {
  Stack,
  Box,
  Input,
  Button,
  Flex,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "hooks/auth";

const IndexPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const toast = useToast();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Preencha ambos os campos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        await login({ email, password });
      } catch (error) {
        toast({
          title: error.data.message,
          description: "Tente novamente",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Layout title="Enalta Jóias">
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Box boxSize="sm" boxShadow="lg" borderRadius="md" bg="white">
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100%"
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Heading size="lg" textAlign="center">
                  Enalta Jóias 💎
                </Heading>
                <Input
                  id="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Senha"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>
              <Button
                colorScheme="blue"
                type="submit"
                width="100%"
                marginTop="4"
                isLoading={loading}
              >
                Entrar
              </Button>
            </form>
          </Flex>
        </Box>
      </Flex>
    </Layout>
  );
};

export default IndexPage;
