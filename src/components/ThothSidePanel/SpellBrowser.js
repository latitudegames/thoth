import React from 'react'

import css from './sidepanel.module.css'

const SpellBrowser = ({nodeList, ...props}) => {
    let spellList = nodeList()

    return (
        <div>
            {Object.keys(spellList).map((item, index) => {
                return <div key={item}>{item}</div>
            })}
        </div>
    )
}

export default SpellBrowser