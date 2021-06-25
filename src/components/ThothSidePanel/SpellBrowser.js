import React from 'react'
import { createNode } from 'rete-context-menu-plugin/src/utils';

import css from './sidepanel.module.css'

const SpellBrowser = ({nodeList, nodeMap, editor,  ...props}) => {
    let spellList = nodeList()
    let nodeScreen = editor()
    let spellMap = nodeMap()

    console.log(spellMap.get("Input"))
    spellMap.forEach(async (value, key) => {
        // if(key === "Input") nodeScreen.addNode(await createNode(value, { x: 0, y: 0 }))
    });

    return (
        <div className={css['node-grid']}>
            {/* {spellMap.forEach((value, key) => {
                return <div className={css['node-grid-item']} key={key} onClick={()=> { nodeScreen.addNode(value)}}>{value.name}</div>
            })} */}

            {Object.keys(spellList).map((item, index)=>{
                return <div className={css['node-grid-item']} key={item} onClick={async ()=> { nodeScreen.addNode(await createNode(spellMap.get(spellList[item].name), { x: 0, y: 0 }))}}>{spellList[item].name}</div>
            })}
        </div>
    )
}

export default SpellBrowser