import { Box, Flex } from "@chakra-ui/react";
const Footer: React.FC = () => {
  return (
    <>
      <Flex
        sx={{
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          my: 5,
        }}
      >
        <Box>© newt 2023</Box>
      </Flex>
    </>
  );
};

export default Footer;
