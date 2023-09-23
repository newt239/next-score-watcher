import { SystemStyleObject } from "@pandacss/dev";

import { css, cva } from "@panda/css";

export const cardRecipe = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "16px",
    p: "8px",
    borderRadius: "lg",
    bg: "gray.200",
  },
});

export type CardProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
} & JSX.IntrinsicElements["div"];

const Card: React.FC<CardProps> = ({ children, sx, ...props }) => {
  return (
    <div className={css(cardRecipe.raw(), sx)} {...props}>
      {children}
    </div>
  );
};

export default Card;
