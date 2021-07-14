import React from 'react'

import css from './startScreen.module.css'

const Panel = ({style, unpadded, shade, shadow, bacgkroundImageURL, hover, roundness, ...props}) => {
  return (
    <div className={`${css['panel']} ${css[unpadded && 'unpadded']} ${css[shadow && 'shadow']} ${css[hover && 'hover']} ${css[roundness]} ${css[shade && 'shade-'+shade]} `} style={{backgroundImage: bacgkroundImageURL ? bacgkroundImageURL : null, ...style}}>
      {props.children}
    </div>
  )
}

export default Panel