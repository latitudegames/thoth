import React from 'react'
import { createNode } from 'rete-context-menu-plugin/src/utils';

import css from './sidepanel.module.css'

const SpellBrowser = ({nodeList, nodeMap, editor,  ...props}) => {
    let spellList = nodeList()
    let nodeScreen = editor()
    let spellMap = nodeMap()

    return (
        <div className={css['node-grid']}>
            {Object.keys(spellList).map((item, index)=>{
                return <div className={css['node-grid-item']} key={item} onClick={async ()=> { nodeScreen.addNode(await createNode(spellMap.get(spellList[item].name), { x: 0, y: 0 }))}}>
                            <div className={css['node-title']}>
                                {spellList[item].name}
                            </div>
                        </div>
            })}
        </div>
    )
}

export default SpellBrowser