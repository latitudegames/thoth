import React, { useState } from 'react'

import Panel from '../Panel/Panel'

import css from './startScreen.module.css'
import enkiImg from './enki.png'
import emptyImg from './empty.png'
import langImg from './lang.png'

const TemplatePanel = ({label, selectedTemplate, setSelectedTemplate, bg}) => {
  return (
    <div className={`${css['template-container']} ${css[selectedTemplate === label && 'selected']}`} onClick={()=> {setSelectedTemplate(label)}}>
      <Panel shadow style={{width: 'var(--c20)', height: 'var(--c12)', backgroundColor: 'var(--dark-3)', backgroundImage: `url(${bg})`}} className={css['template-panel']}></Panel>
      <p>{label}</p>
    </div>
    
  )
}

const StartScreen = ({...props}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  return (
    <div className={css['overlay']}>
      <div className={css['center-container']}>
      <Panel shadow flexColumn >
        <h1> Create New </h1>
        <div style={{width: 'var(--c85)', backgroundColor: 'var(--dark-2)', display: 'flex', flexDirection: 'row', gap: 'var(--extraSmall)'}}>
          <TemplatePanel label="Empty" bg={emptyImg} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/>
          <TemplatePanel label="Language example" bg={langImg} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/>
          <TemplatePanel label="Project with Enki" bg={enkiImg} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/>
        </div>
        <div className={css['button-row']}>
          <button className={!selectedTemplate && "disabled"}> CREATE </button>
        </div>
        </Panel>
        <Panel shadow>
        <h1> Open </h1>
        <Panel style={{width: 'var(--c85)', backgroundColor: 'var(--dark-2)'}} flexRow gap={'var(--small)'} unpadded>
          <button> Browse... </button>
        </Panel>
      </Panel>
      </div>
    </div>
  )
}

export default StartScreen