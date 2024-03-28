import { forwardRef } from 'react'

import { Avatar as ArkAvatar, type AvatarRootProps } from '@ark-ui/react/avatar'

import type { Assign, JsxStyleProps } from 'styled-system/types'

import { css, cx } from 'styled-system/css'
import { splitCssProps } from 'styled-system/jsx'
import { avatar, type AvatarVariantProps } from 'styled-system/recipes'



export interface AvatarProps extends Assign<JsxStyleProps, AvatarRootProps>, AvatarVariantProps {
  name?: string
  src?: string
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const [variantProps, avatarProps] = avatar.splitVariantProps(props)
  const [cssProps, localProps] = splitCssProps(avatarProps)
  const { name, src, className, ...rootProps } = localProps
  const styles = avatar(variantProps)

  return (
    <ArkAvatar.Root className={cx(styles.root, css(cssProps), className)} ref={ref} {...rootProps}>
      <ArkAvatar.Fallback className={styles.fallback}>
        {getInitials(name) || <UserIcon />}
      </ArkAvatar.Fallback>
      <ArkAvatar.Image alt={name} className={styles.image} src={src} />
    </ArkAvatar.Root>
  )
})

Avatar.displayName = 'Avatar'

const UserIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>User Icon</title>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .splice(0, 2)
    .join('')
    .toUpperCase()
