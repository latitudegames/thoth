import React from 'react'
import ThothSidePanel from '../ThothSidePanel/ThothSidePanel'

import Toolbar from '../Toolbar/Toolbar'
import css from './pagewrapper.module.css'

const ThothPageWrapper = ({ toolbarItems, nodeList, ...props}) => {
    return (
        <div>
            <Toolbar>
                {toolbarItems}
            </Toolbar>
            <ThothSidePanel nodeList={nodeList}/>
            {props.children}
        </div>
    )
}
export default ThothPageWrapper