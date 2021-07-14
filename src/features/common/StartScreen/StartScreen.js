import React, { useState } from 'react'

import Panel from '../Panel/Panel'

import css from './startScreen.module.css'
import enkiImg from './enki.png'
import emptyImg from './empty.png'
import langImg from './lang.png'
import thothBanner from './version-banner-0.0.0beta.jpg'

//MAIN

const StartScreen = ({...props}) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [newVisible, setNewVisible] = useState(false)

  return (
    <div className={css['overlay']}>
      <div className={css['center-container']}>
        {newVisible && <CreateNew selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setNewVisible={setNewVisible} />}
        {!newVisible && <OpenProject selectedProject={selectedProject} setSelectedProject={setSelectedProject} setNewVisible={setNewVisible}/>}
      </div>
    </div>
  )
}


//HELPER COMPONENTS


const CreateNew = ( {selectedTemplate, setSelectedTemplate, setNewVisible} ) => {
  return (
    <Panel shadow flexColumn >
        <h1> Create New </h1>
        <div style={{width: 'var(--c85)', backgroundColor: 'var(--dark-2)', display: 'flex', flexDirection: 'row', gap: 'var(--extraSmall)'}}>
          <TemplatePanel label="Empty" bg={emptyImg} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/>
          <TemplatePanel label="Language example" bg={langImg} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/>
          <TemplatePanel label="Project with Enki" bg={enkiImg} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/>
        </div>
        <div className={css['button-row']}>
          <button onClick={() => {setNewVisible(false)}}> cancel </button>
          <button className={!selectedTemplate ? "disabled" : "primary"}> CREATE </button>
        </div>
      </Panel>
  )
}

const OpenProject = ({selectedProject, setSelectedProject, setNewVisible}) => {
  return (
    <Panel shadow unpadded>
      <div className={css['version-banner']} style={{backgroundImage: `url(${thothBanner})`}} />
      <div className={css['open-project-container']}>
        <h1> Recent Projects </h1>

        <Panel style={{width: 'var(--c85)', backgroundColor: 'var(--dark-1)'}} flexColumn gap={'var(--small)'} unpadded>
          <ProjectRow label={"Lorem ipsum"} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
          <ProjectRow label={"Dolor sit"} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
          <ProjectRow label={"Taco Bell ad ambulat"} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
          <ProjectRow label={"Dipsum Ipsum"} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        </Panel>

          <div className={css['button-row']}>
            <button onClick={() => {setNewVisible(true)}}> Create new </button>
            <button> Browse </button>
            <button className={!selectedProject ? "disabled" : "primary"}> OPEN </button>
          </div>
        </div>
    </Panel>
  )
}


const TemplatePanel = ({label, selectedTemplate, setSelectedTemplate, bg}) => {
  return (
    <div className={`${css['template-container']} ${css[selectedTemplate === label && 'selected']}`} onClick={()=> {setSelectedTemplate(label)}}>
      <Panel shadow style={{width: 'var(--c20)', height: 'var(--c12)', backgroundColor: 'var(--dark-3)', backgroundImage: `url(${bg})`}} className={css['template-panel']}></Panel>
      <p>{label}</p>
    </div>
    
  )
}

const ProjectRow = ({label, selectedProject, setSelectedProject}) => {
  return (
    <div className={`${css['project-row']} ${css[selectedProject === label ? 'selected' : '']}`} onClick={() => {setSelectedProject(label)}}>
        {label}
    </div>
  )
}

export default StartScreen