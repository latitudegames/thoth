import React, { useState } from 'react'

import css from './sidepanel.module.css'

const ThothSidePanel = ({...props}) => {
    const [activeTab, setActiveTab] = useState('spellBrowser')

    const playTest = ''
    const spellBrowser = ''

    const tabs = {
        spellBrowser: {
            title: "Spell Browser",
            component: spellBrowser
        },
        playtest: {
            title: "Playtest",
            component: playTest
        }
    }

    return (
    <div className={css['th-sidepanel']}>
        <div className={css['tabs']}>
            {Object.keys(tabs).map((item) => {
                console.log(item)
                return <div onClick={() => {
                    setActiveTab(item)
                }}className={`${css['tab']} ${css[activeTab === item ? 'active' : '']}`}>{tabs[item].title}</div>
            })}
        </div>
        <div className={css['tab-page']}>
            hi
        </div>
    </div>)
}

export default ThothSidePanel