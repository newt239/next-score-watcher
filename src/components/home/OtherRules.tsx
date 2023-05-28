import { Link as ReactLink } from "react-router-dom";

import { Box, Link, ListItem, UnorderedList } from "@chakra-ui/react";

const OtherRules: React.FC = () => {
  return (
    <Box pt={5}>
      <h2>その他の形式</h2>
      <UnorderedList>
        <ListItem>
          <Link as={ReactLink} to="/aql" color="blue.500">
            AQLルール
          </Link>
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default OtherRules;
