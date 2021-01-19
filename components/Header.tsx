import React from "react";
import {
  Flex,
  Divider,
  Heading,
  Image,
  Spacer,
  Button,
} from "@chakra-ui/react";
import UserShortcut from "components/UserShortcut";
interface Props {
  flex: string;
}
import navigation from "utils/navigation";
import Link from "next/link";

const Header = ({ flex }: Props) => {
  return (
    <Flex flexDirection="column" flex={flex}>
      <Flex flexDirection="row" alignItems="center" paddingBottom="4">
        <Image
          src="/images/logo.jpg"
          alt="Enalta Joias"
          borderRadius="md"
          boxSize="48px"
        />
        <Heading paddingLeft="4" paddingRight="4" size="sm">
          Enalta Jóias
        </Heading>

        {navigation.map((nav, index) => (
          <Link href={nav.url} key={index}>
            <Button leftIcon={<nav.icon />} color="gray.600" variant="ghost">
              {nav.title}
            </Button>
          </Link>
        ))}

        <Spacer />
        <UserShortcut />
      </Flex>
      <Divider />
    </Flex>
  );
};

export default Header;
