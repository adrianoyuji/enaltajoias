import React, { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import Header from "components/Header";
interface Prop {
  children: ReactNode;
}

const WhiteBox = ({ children }: Prop) => {
  return (
    <Flex
      margin="1%"
      width="100%"
      height="98%"
      borderRadius="md"
      boxShadow="md"
      bg="white"
      overflowY="scroll"
      overflowX="scroll"
      flexDirection="column"
      padding="4"
      css={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Header flex="1" />
      <Flex flex="9"> {children}</Flex>
    </Flex>
  );
};

export default WhiteBox;
