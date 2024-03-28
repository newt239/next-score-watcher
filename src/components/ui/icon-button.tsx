import type { ComponentProps } from 'react'

import { ark } from '@ark-ui/react/factory'

import { styled } from 'styled-system/jsx'
import { iconButton } from 'styled-system/recipes'

export const IconButton = styled(ark.button, iconButton)
export interface IconButtonProps extends ComponentProps<typeof IconButton> {}
