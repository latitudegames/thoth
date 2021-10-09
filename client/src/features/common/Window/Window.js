import { Scrollbars } from 'react-custom-scrollbars'

import WindowToolbar from './WindowToolbar'

import css from './window.module.css'

const WindowLayout = props => {
  return (
    <div className={css['window-layout']}>
      <Scrollbars>{props.children}</Scrollbars>
    </div>
  )
}

const Window = ({ outline, dark, borderless, darker, grid, ...props }) => {
  return (
    <div
      className={`
      ${css['window']} 
      ${css[outline && 'bordered']} 
      ${css[dark && 'darkened']} 
      ${css[darker && 'darker']} 
      ${css[borderless && 'unpadded']}
      ${css[grid && 'grid']}
      `}
    >
      <WindowToolbar>{props.toolbar}</WindowToolbar>
      <WindowLayout>{props.children}</WindowLayout>
    </div>
  )
}

export default Window
