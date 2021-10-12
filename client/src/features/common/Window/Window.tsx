import { Scrollbars } from 'react-custom-scrollbars'

import WindowToolbar from './WindowToolbar'

import css from './window.module.css'
import { ReactElement } from 'react'

const WindowLayout = props => {
  return (
    <div className={css['window-layout']}>
      <Scrollbars>{props.children}</Scrollbars>
    </div>
  )
}

type Props = {
  outline?: boolean
  dark?: boolean
  borderless?: boolean
  darker?: boolean
  grid?: boolean
  toolbar: ReactElement<any, any>
  children: ReactElement<any, any> | ReactElement<any, any>[]
}

const Window = (props: Props) => {
  const {
    outline = false,
    dark = false,
    borderless = false,
    darker = false,
    grid = false,
  } = props

  return (
    <div
      className={`
      ${css['window']} 
      ${css[outline ? 'bordered' : '']} 
      ${css[dark ? 'darkened' : '']} 
      ${css[darker ? 'darker' : '']} 
      ${css[borderless ? 'unpadded' : '']}
      ${css[grid ? 'grid' : '']}
      `}
    >
      <WindowToolbar>{props.toolbar}</WindowToolbar>
      <WindowLayout>{props.children}</WindowLayout>
    </div>
  )
}

export default Window
