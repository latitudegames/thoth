import React, { useState } from 'react'
import { useLocation } from 'wouter'

import { useNewSpellMutation, useGetSpellsQuery } from '../../state/spells'
import { useDB } from '../../contexts/DatabaseProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import AllProjects from './components/AllProjects'
import CreateNew from './components/CreateNew'
import OpenProject from './components/OpenProject'
import css from './startScreen.module.css'

//MAIN

const StartScreen = ({ createNew, allProjects }) => {
  const models = useDB()
  const { openTab } = useTabManager()
  const [, setLocation] = useLocation()

  const [newSpell] = useNewSpellMutation()
  const { data: spells } = useGetSpellsQuery()

  const projects = [
    { label: 'Lorem ipsum' },
    { label: 'Dolor sit' },
    { label: 'Taco Bell ad ambulat' },
    { label: 'Candor umlaut' },
  ]

  const onReaderLoad = async event => {
    const spellData = JSON.parse(event.target.result)
    // TODO check for proper values here and throw errors

    const existingSpell = await models.spells.getSpell(spellData.name)
    const spell = existingSpell ? existingSpell : await newSpell(spellData)

    // Load modules from the spell
    if (spellData?.modules && spellData.modules.length > 0)
      await Promise.all(
        spellData.modules.map(module => {
          return models.modules.updateOrCreate(module)
        })
      )

    await openTab({ name: spell.name, spellId: spell.name, type: 'spell' })
  }

  const loadFile = selectedFile => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(selectedFile)
  }

  const openSpell = async spell => {
    await openTab({ name: spell.name, spellId: spell.name, type: 'spell' })
    setLocation('/thoth')
  }

  const [selectedSpell, setSelectedSpell] = useState(null)

  return (
    <div className={css['overlay']}>
      <div className={css['center-container']}>
        {createNew && <CreateNew />}
        {allProjects && (
          <AllProjects
            spells={spells}
            openSpell={openSpell}
            projects={projects}
            selectedSpell={selectedSpell}
            setSelectedSpell={setSelectedSpell}
            loadFile={loadFile}
          />
        )}
        {!createNew && !allProjects && (
          <OpenProject
            spells={spells}
            projects={projects}
            selectedSpell={selectedSpell}
            setSelectedSpell={setSelectedSpell}
            loadFile={loadFile}
          />
        )}
      </div>
    </div>
  )
}

export default StartScreen
