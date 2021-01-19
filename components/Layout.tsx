import React, { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import Footer from "components/Footer";
interface Props {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: Props) => {
  const [innerHeight, setInnerHeight] = useState("100vh");
  useEffect(() => {
    setInnerHeight(`${window.innerHeight}px`);
  }, []);

  return (
    <Flex
      direction="column"
      bg="gray.50"
      color="black"
      height={innerHeight}
      width="100vw"
      bgGradient="linear(to-b,#AA771C,#FCF6BA,#AA771C)"
    >
      <Head>
        <link rel="shortcut icon" sizes="48x48" href="/favicon.jpg" />
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Flex
        flex="99"
        width="100%"
        overflowY="scroll"
        overflowX="hidden"
        css={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {children}
      </Flex>
      <Footer flex="1" />
    </Flex>
  );
};

export default Layout;
