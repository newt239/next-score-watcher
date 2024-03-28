import { forwardRef, type ReactNode } from 'react'

import { Checkbox as ArkCheckbox, type CheckboxRootProps } from '@ark-ui/react/checkbox'

import type { Assign, JsxStyleProps } from 'styled-system/types'

import { css, cx } from 'styled-system/css'
import { splitCssProps } from 'styled-system/jsx'
import { checkbox, type CheckboxVariantProps } from 'styled-system/recipes'



export interface CheckboxProps
  extends Assign<JsxStyleProps, CheckboxRootProps>,
    CheckboxVariantProps {
  children?: ReactNode
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>((props, ref) => {
  const [variantProps, checkboxProps] = checkbox.splitVariantProps(props)
  const [cssProps, localProps] = splitCssProps(checkboxProps)
  const { children, className, ...rootProps } = localProps
  const styles = checkbox(variantProps)

  return (
    <ArkCheckbox.Root
      className={cx(styles.root, css(cssProps), className)}
      ref={ref}
      {...rootProps}
    >
      {(state) => (
        <>
          <ArkCheckbox.Control className={styles.control}>
            {state.isChecked && <CheckIcon />}
            {state.isIndeterminate && <MinusIcon />}
          </ArkCheckbox.Control>
          {children && <ArkCheckbox.Label className={styles.label}>{children}</ArkCheckbox.Label>}
        </>
      )}
    </ArkCheckbox.Root>
  )
})

Checkbox.displayName = 'Checkbox'

const CheckIcon = () => (
  <svg fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <title>Check Icon</title>
    <path
      d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

const MinusIcon = () => (
  <svg fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <title>Minus Icon</title>
    <path
      d="M2.91675 7H11.0834"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)
