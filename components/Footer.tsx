import React from "react";
import { Flex, Text } from "@chakra-ui/react";

interface Props {
  text?: string;
  flex: string;
}

const year = new Date().getFullYear();

const Footer = ({ text = `Enalta Jóias © ${year}`, flex }: Props) => {
  return (
    <Flex flex={flex} width="100vw" justifyContent="center">
      <Text color="white">{text}</Text>
    </Flex>
  );
};

export default Footer;
