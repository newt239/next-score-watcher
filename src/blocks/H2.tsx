import { ReactNode } from "react";

import { Heading, SystemStyleObject } from "@chakra-ui/react";

interface H2Props {
  children: ReactNode;
  sx?: SystemStyleObject;
}

const H2: React.FC<H2Props> = ({ children, sx }) => {
  return (
    <Heading as="h2" size="lg" pt={5} sx={sx}>
      {children}
    </Heading>
  );
};

export default H2;
