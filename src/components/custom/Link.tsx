import { Link as ReactLink } from "react-router-dom";

import { RecipeVariantProps, css, cva, cx } from "@panda/css";
import { SystemStyleObject } from "@panda/types";

export const anchorRecipe = cva({
  base: {
    _hover: {
      textDecoration: "underline",
    },
    alignItems: "center",
    color: "blue.500",
    display: "inline-flex",
  },
});

export type LinkProps = {
  children: React.ReactNode;
  href: string;
  sx?: SystemStyleObject;
  // JSX.IntrinsicElements["a"]はnext/linkが受け付けない
} & React.HTMLAttributes<HTMLAnchorElement> &
  RecipeVariantProps<typeof anchorRecipe>;

const Link: React.FC<LinkProps> = (props) => {
  const { children, href, sx, ...rest } = props;
  const [anchorProps, restProps] = anchorRecipe.splitVariantProps(rest);
  return (
    <ReactLink
      className={cx(anchorRecipe(anchorProps), css(sx))}
      to={href}
      {...restProps}
      target={href.startsWith("http") ? "_blank" : "_self"}
    >
      {children}
    </ReactLink>
  );
};

export default Link;
