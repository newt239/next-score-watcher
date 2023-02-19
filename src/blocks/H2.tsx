import { Heading, HeadingProps } from "@chakra-ui/react";

const H2: React.FC<HeadingProps> = (props) => {
  return (
    <Heading
      as="h2"
      size="lg"
      pt={5}
      whiteSpace="nowrap"
      textOverflow="ellipsis"
      {...props}
    >
      {props.children}
    </Heading>
  );
};

export default H2;
