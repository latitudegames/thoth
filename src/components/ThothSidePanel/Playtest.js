import React from 'react'

import css from './sidepanel.module.css'

const Playtest = ({...props}) => {
    return (
        <>
            <div className={css['playtest-output']}>
            This is example output.
            </div>
            <div className={css['input']}>
                <input type="text"></input>
                <button className="primary">Send</button>
            </div>
        </>
    )
}

export default Playtest