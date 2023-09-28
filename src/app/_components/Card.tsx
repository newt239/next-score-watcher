import { SystemStyleObject } from "@pandacss/dev";

import { css, cva } from "@panda/css";

export const cardRecipe = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "8px",
    p: "8px",
    borderRadius: "lg",
    bgColor: "gray.200",
  },
});

export type CardProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  title?: string;
  action?: React.ReactNode;
} & JSX.IntrinsicElements["div"];

const Card: React.FC<CardProps> = ({
  children,
  sx,
  title,
  action,
  ...props
}) => {
  return (
    <div className={css(cardRecipe.raw(), sx)} {...props}>
      {title && (
        <h4
          className={css({
            fontSize: "1.5rem",
            fontWeight: "800",
            whiteSpace: "nowrap",
            overflowX: "auto",
          })}
        >
          {title}
        </h4>
      )}
      <div
        className={css({
          flexGrow: 1,
        })}
      >
        {children}
      </div>
      {action && (
        <div
          className={css({
            display: "flex",
            justifyContent: "flex-end",
          })}
        >
          {action}
        </div>
      )}
    </div>
  );
};

export default Card;
