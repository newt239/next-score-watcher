import { css, cva, cx } from "@panda/css";
import { SystemStyleObject } from "@panda/types";

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
  title?: string;
  action?: React.ReactNode;
  sx?: SystemStyleObject;
} & JSX.IntrinsicElements["div"];

const Card: React.FC<CardProps> = (props) => {
  const { children, title, action, sx, ...rest } = props;
  const [componentProps, restProps] = cardRecipe.splitVariantProps(rest);
  return (
    <div className={cx(cardRecipe(componentProps), css(sx))} {...restProps}>
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
