import { Heading, HeadingProps } from "@chakra-ui/react";

const H3: React.FC<HeadingProps> = (props) => {
  return (
    <Heading
      as="h3"
      size="md"
      pt={5}
      whiteSpace="nowrap"
      overflowX="hidden"
      textOverflow="ellipsis"
      {...props}
    >
      {props.children}
    </Heading>
  );
};

export default H3;
