import { Scrollbars } from 'react-custom-scrollbars'

import css from './window.module.css'

const WindowToolbar = props => {
  return <div className={css['window-toolbar']}>{props.children}</div>
}

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
