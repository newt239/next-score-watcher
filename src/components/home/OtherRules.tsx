import { Link as ReactLink } from "react-router-dom";

import { Box, Link, ListItem, UnorderedList } from "@chakra-ui/react";

export type AQLGameProps = {
  id: string;
  name: string;
  left_team: string;
  right_team: string;
  quiz: {
    set_name: string;
    offset: number;
  };
  last_open: string;
};

const OtherRules: React.FC = () => {
  return (
    <Box pt={5}>
      <h2>その他の形式</h2>
      <UnorderedList pt={5}>
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
