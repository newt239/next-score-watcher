import { SystemStyleObject } from "@pandacss/dev";

import { css, cva, cx } from "@panda/css";

export const cardRecipe = cva({
  base: {
    backgroundColor: "gray.200",
    borderRadius: "lg",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    justifyContent: "space-between",
    p: "8px",
  },
});

export type CardProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  title?: string;
  action?: React.ReactNode;
} & JSX.IntrinsicElements["div"];

const Card: React.FC<CardProps> = (props) => {
  const { children, title, action, ...rest } = props;
  const [componentProps, cssProps] = cardRecipe.splitVariantProps(rest);
  return (
    <div className={cx(cardRecipe(componentProps), css(cssProps))} {...props}>
      {title && (
        <h4
          className={css({
            fontSize: "1.5rem",
            fontWeight: "800",
            overflowX: "auto",
            whiteSpace: "nowrap",
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
