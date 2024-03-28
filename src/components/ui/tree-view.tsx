import { forwardRef } from "react";

import {
  TreeView as ArkTreeView,
  type TreeViewRootProps,
} from "@ark-ui/react/tree-view";
import { ArrowRight } from "tabler-icons-react";

import type { Assign, JsxStyleProps } from "styled-system/types";

import { css, cx } from "styled-system/css";
import { splitCssProps } from "styled-system/jsx";
import { treeView } from "styled-system/recipes";

interface Child {
  id: string;
  name: string;
  children?: Child[];
}

export interface TreeViewData {
  label: string;
  children: Child[];
}

export interface TreeViewProps
  extends Assign<JsxStyleProps, TreeViewRootProps> {
  data: TreeViewData;
}

export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (props, ref) => {
    const [cssProps, localProps] = splitCssProps(props);
    const { data, className, ...rootProps } = localProps;
    const styles = treeView();

    const renderChild = (child: Child) => (
      <ArkTreeView.Branch
        className={styles.branch}
        id={child.id}
        key={child.id}
      >
        <ArkTreeView.BranchControl className={styles.branchControl}>
          <ArkTreeView.BranchIndicator className={styles.branchIndicator}>
            <ArrowRight />
          </ArkTreeView.BranchIndicator>
          <ArkTreeView.BranchText className={styles.branchText}>
            {child.name}
          </ArkTreeView.BranchText>
        </ArkTreeView.BranchControl>
        <ArkTreeView.BranchContent className={styles.branchContent}>
          {child.children?.map((child) =>
            child.children ? (
              renderChild(child)
            ) : (
              <ArkTreeView.Item
                className={styles.item}
                id={child.id}
                key={child.id}
              >
                <ArkTreeView.ItemText className={styles.itemText}>
                  {child.name}
                </ArkTreeView.ItemText>
              </ArkTreeView.Item>
            )
          )}
        </ArkTreeView.BranchContent>
      </ArkTreeView.Branch>
    );

    return (
      <ArkTreeView.Root
        aria-label={data.label}
        className={cx(styles.root, css(cssProps), className)}
        ref={ref}
        {...rootProps}
      >
        <ArkTreeView.Tree className={styles.tree}>
          {data.children.map(renderChild)}
        </ArkTreeView.Tree>
      </ArkTreeView.Root>
    );
  }
);

TreeView.displayName = "TreeView";
