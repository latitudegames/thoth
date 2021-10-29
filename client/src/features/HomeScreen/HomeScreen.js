import React, { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { useSaveSpellMutation, useGetSpellsQuery } from '../../state/spells'
import { useDB } from '../../contexts/DatabaseProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import AllProjects from './screens/AllProjects'
import CreateNew from './screens/CreateNew'
import OpenProject from './screens/OpenProject'
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

  const deleteSpell = spellId => {
    console.log('DELETE SPWELL', spellId)
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
        <Routes>
          <Route
            path=""
            element={
              <OpenProject
                spells={spells}
                selectedSpell={selectedSpell}
                setSelectedSpell={setSelectedSpell}
                loadFile={loadFile}
              />
            }
          />
          <Route
            path="all-projects"
            element={
              <AllProjects
                spells={spells}
                openSpell={openSpell}
                selectedSpell={selectedSpell}
                setSelectedSpell={setSelectedSpell}
                loadFile={loadFile}
                onDelete={deleteSpell}
              />
            }
          />
          <Route path="create-new" element={<CreateNew />} />
        </Routes>
      </div>
    </div>
  )
}

export default StartScreen
