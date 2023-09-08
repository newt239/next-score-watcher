import Link from "next/link";

import {
  Box,
  Link as ChakraLink,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

const OtherRules: React.FC = () => {
  return (
    <Box pt={5}>
      <h2>その他の形式</h2>
      <UnorderedList>
        <ListItem>
          <ChakraLink as={Link} color="blue.500" href="/aql">
            AQLルール
          </ChakraLink>
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default OtherRules;
