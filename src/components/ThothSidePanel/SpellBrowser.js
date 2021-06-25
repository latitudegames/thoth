import React from 'react'

import css from './sidepanel.module.css'

const SpellBrowser = ({nodeList, editor,  ...props}) => {
    let spellList = nodeList()
    let nodeScreen = editor()
    console.log(nodeScreen)
    console.log(spellList)

    return (
        <div>
            {Object.keys(spellList).map((item, index) => {
                return <div key={item}>{spellList[item].name}</div>
            })}
        </div>
    )
}

export default SpellBrowser