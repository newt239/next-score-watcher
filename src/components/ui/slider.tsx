import { forwardRef, type ReactNode } from 'react'

import { Slider as ArkSlider, type SliderRootProps } from '@ark-ui/react/slider'

import type { Assign, JsxStyleProps } from 'styled-system/types'

import { css, cx } from 'styled-system/css'
import { splitCssProps } from 'styled-system/jsx'
import { slider, type SliderVariantProps } from 'styled-system/recipes'



export interface SliderProps extends Assign<JsxStyleProps, SliderRootProps>, SliderVariantProps {
  children?: ReactNode
  marks?: {
    value: number
    label?: ReactNode
  }[]
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const [variantProps, sliderProps] = slider.splitVariantProps(props)
  const [cssProps, localProps] = splitCssProps(sliderProps)
  const { children, className, ...rootProps } = localProps
  const styles = slider(variantProps)

  return (
    <ArkSlider.Root className={cx(styles.root, css(cssProps), className)} ref={ref} {...rootProps}>
      {(api) => (
        <>
          {children && <ArkSlider.Label className={styles.label}>{children}</ArkSlider.Label>}
          <ArkSlider.Control className={styles.control}>
            <ArkSlider.Track className={styles.track}>
              <ArkSlider.Range className={styles.range} />
            </ArkSlider.Track>
            {api.value.map((_, index) => (
              <ArkSlider.Thumb className={styles.thumb} index={index} key={index} />
            ))}
          </ArkSlider.Control>
          {props.marks && (
            <ArkSlider.MarkerGroup className={styles.markerGroup}>
              {props.marks.map((mark) => (
                <ArkSlider.Marker className={styles.marker} key={mark.value} value={mark.value}>
                  {mark.label}
                </ArkSlider.Marker>
              ))}
            </ArkSlider.MarkerGroup>
          )}
        </>
      )}
    </ArkSlider.Root>
  )
})

Slider.displayName = 'Slider'
