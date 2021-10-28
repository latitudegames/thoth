import React, { useState } from 'react'
import { useHistory, Route, Switch, useNavigate } from 'react-router-dom'

import { useSaveSpellMutation, useGetSpellsQuery } from '../../state/spells'
import { useDB } from '../../contexts/DatabaseProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import AllProjects from './components/AllProjects'
import CreateNew from './components/CreateNew'
import OpenProject from './components/OpenProject'
import css from './homeScreen.module.css'
import LoadingScreen from '../common/LoadingScreen/LoadingScreen'

//MAIN

const StartScreen = ({ createNew, allProjects }) => {
  const models = useDB()
  const { openTab } = useTabManager()
  const navigate = useNavigate()

  const [saveSpell] = useSaveSpellMutation()
  const { data: spells } = useGetSpellsQuery()

  const onReaderLoad = async event => {
    const spellData = JSON.parse(event.target.result)
    // TODO check for proper values here and throw errors
    let spell
    try {
      spell = await models.spells.getSpell(spellData.name)
    } catch (error) {
      spell = await saveSpell(spellData)
    }
    // Load modules from the spell
    if (spellData?.modules && spellData.modules.length > 0)
      await Promise.all(
        spellData.modules.map(module => {
          return models.modules.updateOrCreate(module)
        })
      )

    await openTab({
      name: spellData.name,
      spellId: spellData.name,
      type: 'spell',
    })
  }

  const loadFile = selectedFile => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(selectedFile)
  }

  const openSpell = async spell => {
    await openTab({ name: spell.name, spellId: spell.name, type: 'spell' })
    navigate('/thoth')
  }

  const [selectedSpell, setSelectedSpell] = useState(null)

  if (!spells) return <LoadingScreen />

  return (
    <div className={css['overlay']}>
      <div className={css['center-container']}>
        {/* <Router>
          <Switch path="" />
          <Switch />
          <Switch />
        </Router> */}
        {createNew && <CreateNew />}
        {allProjects && (
          <AllProjects
            spells={spells}
            openSpell={openSpell}
            selectedSpell={selectedSpell}
            setSelectedSpell={setSelectedSpell}
            loadFile={loadFile}
          />
        )}
        {!createNew && !allProjects && (
          <OpenProject
            spells={spells}
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
