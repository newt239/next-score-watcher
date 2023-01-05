import { ReactNode } from "react";

import { Heading, SystemStyleObject } from "@chakra-ui/react";

interface H3Props {
  children: ReactNode;
  sx?: SystemStyleObject;
}

const H3: React.FC<H3Props> = ({ children, sx }) => {
  return (
    <Heading as="h3" size="md" pt={5} sx={sx}>
      {children}
    </Heading>
  );
};

export default H3;
