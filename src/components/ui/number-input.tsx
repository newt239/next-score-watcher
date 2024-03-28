import { forwardRef, type ReactNode } from 'react'

import {
  NumberInput as ArkNumberInput,
  type NumberInputRootProps,
} from '@ark-ui/react/number-input'

import type { Assign, JsxStyleProps } from 'styled-system/types'

import { css, cx } from 'styled-system/css'
import { splitCssProps } from 'styled-system/jsx'
import { numberInput, type NumberInputVariantProps } from 'styled-system/recipes'



export interface NumberInputProps
  extends Assign<JsxStyleProps, NumberInputRootProps>,
    NumberInputVariantProps {
  children?: ReactNode
}

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>((props, ref) => {
  const [variantProps, numberInputProps] = numberInput.splitVariantProps(props)
  const [cssProps, localProps] = splitCssProps(numberInputProps)
  const { children, className, ...rootProps } = localProps
  const styles = numberInput(variantProps)

  return (
    <ArkNumberInput.Root
      className={cx(styles.root, css(cssProps), className)}
      ref={ref}
      {...rootProps}
    >
      {children && <ArkNumberInput.Label className={styles.label}>{children}</ArkNumberInput.Label>}
      <ArkNumberInput.Control className={styles.control}>
        <ArkNumberInput.Input className={styles.input} />
        <ArkNumberInput.IncrementTrigger className={styles.incrementTrigger}>
          <ChevronUpIcon />
        </ArkNumberInput.IncrementTrigger>
        <ArkNumberInput.DecrementTrigger className={styles.decrementTrigger}>
          <ChevronDownIcon />
        </ArkNumberInput.DecrementTrigger>
      </ArkNumberInput.Control>
    </ArkNumberInput.Root>
  )
})

NumberInput.displayName = 'NumberInput'

const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Chevron Up Icon</title>
    <path
      d="m18 15l-6-6l-6 6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Chevron Down Icon</title>
    <path
      d="m6 9l6 6l6-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)
