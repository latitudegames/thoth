import React from 'react'

import Toolbar from '../Toolbar/Toolbar'
import css from './pagewrapper.module.css'

const ThothPageWrapper = ({ toolbarItems, ...props}) => {
    return (
        <div>
            <Toolbar>
                {toolbarItems}
            </Toolbar>
            {props.children}
        </div>
    )
}
export default ThothPageWrapper