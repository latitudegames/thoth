import React, { useState } from 'react'

import css from './sidepanel.module.css'

const ThothSidePanel = ({...props}) => {
    const [activeTab, setActiveTab] = useState('spellBrowser')

    const playTest = 'Playtest: eventually we\'ll need to populate and trigger visibility intead of the component itself so we don\'t trigger a reset'
    const spellBrowser = 'This is the spell browser.'

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
            {tabs[activeTab].component}
        </div>
    </div>)
}

export default ThothSidePanel