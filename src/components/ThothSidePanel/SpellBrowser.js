import React from 'react'

import css from './sidepanel.module.css'

const SpellBrowser = ({nodeList, editor,  ...props}) => {
    let spellList = nodeList()
    let nodeScreen = editor()
    console.log(nodeScreen)
    console.log(spellList)

    return (
        <div className={css['node-grid']}>
            {Object.keys(spellList).map((item, index) => {
                return <div className={css['node-grid-item']} key={item} onClick={()=> { nodeScreen.addNode(item)}}>{spellList[item].name}</div>
            })}
        </div>
    )
}

export default SpellBrowser