import React from 'react'
import ThothSidePanel from '../ThothSidePanel/ThothSidePanel'

import Toolbar from '../Toolbar/Toolbar'
import css from './pagewrapper.module.css'

const ThothPageWrapper = ({ toolbarItems, editor, ...props}) => {
    return (
        <div>
            <Toolbar>
                {toolbarItems}
            </Toolbar>
            <ThothSidePanel editor={editor}/>
            {props.children}
        </div>
    )
}
export default ThothPageWrapper