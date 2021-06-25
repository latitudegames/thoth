import React from 'react'

import css from './toolbar.module.css'
import thothlogo from './thoth.png'

const ThothToolbar = ({...props}) => {
    return(
        <div className={css['th-toolbar']}>
            <div className={css['toolbar-section']}>
                <img className={css['thoth-logo']} src={thothlogo}/>
            </div>
            <div className={css['toolbar-section']}>
                {props.children}
            </div>
        </div>
    )
}

export default ThothToolbar