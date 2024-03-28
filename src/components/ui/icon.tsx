import { forwardRef, type ReactElement } from 'react'

import { ark } from '@ark-ui/react/factory'

import { styled, type HTMLStyledProps } from 'styled-system/jsx'
import { icon, type IconVariantProps } from 'styled-system/recipes'

export interface IconProps extends IconVariantProps, HTMLStyledProps<'svg'> {
  children: ReactElement
}

export const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return <StyledIcon asChild ref={ref} {...props} />
})

const StyledIcon = styled(ark.svg, icon)
