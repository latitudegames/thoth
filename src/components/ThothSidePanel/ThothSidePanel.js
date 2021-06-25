import React, { useState } from 'react'

import css from './sidepanel.module.css'

const ThothSidePanel = ({...props}) => {
    const [activeTab, setActiveTab] = useState('spellBrowser')
    return (
    <div className={css['th-sidepanel']}>
        <div className={css['tabs']}>
            <div className={css['tab']}>SPELL BROWSER</div>
            <div className={css['tab']}>PLAYTEST</div>
        </div>
        <div className={css['tab-page']}>
            hi
        </div>
    </div>)
}

export default ThothSidePanel