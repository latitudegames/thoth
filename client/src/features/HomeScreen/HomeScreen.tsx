import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import {
  useGetSpellsQuery,
  useDeleteSpellMutation,
} from '../../state/api/spells'
import { useDB } from '../../contexts/DatabaseProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import AllProjects from './screens/AllProjects'
import CreateNew from './screens/CreateNew'
import OpenProject from './screens/OpenProject'
import css from './homeScreen.module.css'
import LoadingScreen from '../common/LoadingScreen/LoadingScreen'
import { ModelsType } from '../../types'

//MAIN

const StartScreen = () => {
  const { models } = useDB() as unknown as ModelsType
  const { openTab, closeTabBySpellId } = useTabManager()
  const navigate = useNavigate()

  const [deleteSpell] = useDeleteSpellMutation()
  const { data: spells } = useGetSpellsQuery()

  const onReaderLoad = async event => {
    const spellData = JSON.parse(event.target.result)
    if (spellData.graph) {
      spellData.chain = spellData.graph
      delete spellData.graph
    }
    // TODO check for proper values here and throw errors

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

    navigate('/thoth')
  }

  const loadFile = selectedFile => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(selectedFile)
  }

  const onDelete = async spellId => {
    try {
      await deleteSpell(spellId)
      await closeTabBySpellId(spellId)
    } catch (err) {
      console.log('Error deleting spell', err)
    }
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
                openSpell={openSpell}
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
                onDelete={onDelete}
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
