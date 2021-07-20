import React from 'react'

import css from './icon.module.css'

const Icon = ({name, size, style}) => {
  if(!size) size = 16
  if (!name) name = 'warn'
  return <div className={`${css['icon']} ${css[name]}`} style={{height: size, width: size, ...style}}></div>
}

export default Icon