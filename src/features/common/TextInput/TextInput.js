import React from 'react'

import css from './textinput.module.css'

const TextInput = ({value, onChange, className, ...props}) => {
  return (
    <input type="text" value={value} onChange={onChange} className={`${css['text-input']}` + className}/>
  )
}

export default TextInput