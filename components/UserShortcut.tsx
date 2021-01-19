import React from "react";
import { useAuth } from "hooks/auth";
import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";

const UserShortcut = () => {
  const { user, signed, signout, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await signout();
      toast({
        title: "Você saiu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      router.replace("/");
    } catch (error) {}
  };

  return signed ? (
    <Popover>
      <PopoverTrigger>
        <Flex
          justifyContent="center"
          alignItems="center"
          role="button"
          _hover={{ opacity: "0.8" }}
        >
          <Image
            src="/images/avatar/avatar.png"
            alt="Avatar"
            width={36}
            height={36}
          />
          <Flex flexDirection="column">
            <Text fontSize="sm" paddingLeft="4" paddingRight="2" as="b">
              Olá, {user?.full_name}
            </Text>
          </Flex>
        </Flex>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Text>{user?.full_name}</Text>
          <Text as="b">{user?.email}</Text>
        </PopoverHeader>
        <PopoverBody>
          <Stack spacing={4} direction="column">
            <Button
              onClick={() => handleLogout()}
              colorScheme="red"
              leftIcon={<BiLogOut />}
              isLoading={loading}
            >
              Sair
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : null;
};

export default UserShortcut;
