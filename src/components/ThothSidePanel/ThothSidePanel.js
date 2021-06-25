import React, { useState } from 'react'

import css from './sidepanel.module.css'
import SpellBrowser from './SpellBrowser'
import Playtest from './Playtest'

const ThothSidePanel = ({editor, ...props}) => {
    const [activeTab, setActiveTab] = useState('playtest')

    const tabs = {
        spellBrowser: {
            title: "Spell Browser",
            component: <SpellBrowser />
        },
        playtest: {
            title: "Playtest",
            component: <Playtest />
        }
    }

    return (
    <div className={css['th-sidepanel']}>
        <div className={css['tabs']}>
            {Object.keys(tabs).map((item) => {
                return <div onClick={() => {
                    setActiveTab(item)
                    console.log(editor)
                }}className={`${css['tab']} ${css[activeTab === item ? 'active' : '']}`}>{tabs[item].title}</div>
            })}
        </div>
        <div className={css['tab-page']}>
            {tabs[activeTab].component}
        </div>
    </div>)
}

export default ThothSidePanel