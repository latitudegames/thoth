import { useState, useEffect } from 'react'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'
import { useNavigate } from 'react-router-dom'

import { useNewSpellMutation } from '../../../state/api/spells'
import { useTabManager } from '../../../contexts/TabManagerProvider'
import Panel from '../../common/Panel/Panel'
import emptyImg from '../empty.png'
import enkiImg from '../enki.png'
import langImg from '../lang.png'
import css from '../homeScreen.module.css'
import TemplatePanel from '../components/TemplatePanel'

const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

const defaultGraph = {
  id: 'demo@0.1.0',
  nodes: {},
}

const templates = [
  { label: 'Empty', bg: emptyImg },
  { label: 'Language example', bg: langImg },
  { label: 'Enki example', bg: enkiImg },
]

const CreateNew = () => {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const [newSpell] = useNewSpellMutation()

  const { openTab, clearTabs } = useTabManager()

  const onCreate = async () => {
    const placeholderName = uniqueNamesGenerator(customConfig)
    const { data: spell } = await newSpell({
      chain: defaultGraph,
      name: placeholderName,
    })

    await clearTabs()
    await openTab({
      name: placeholderName,
      spellId: placeholderName,
      type: 'spell',
    })

    navigate('/thoth')
  }

  return (
    <Panel shadow flexColumn>
      <h1> Create New </h1>
      <div
        style={{
          width: 'var(--c62)',
          backgroundColor: 'var(--dark-2)',
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--extraSmall)',
        }}
      >
        {templates.map((template, i) => (
          <TemplatePanel
            setSelectedTemplate={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
            label={template.label}
            bg={template.bg}
            key={i}
          />
        ))}
      </div>
      <div className={css['button-row']}>
        <button
          onClick={() => {
            window.history.back()
          }}
        >
          cancel
        </button>
        <button
          className={!selectedTemplate ? 'disabled' : 'primary'}
          onClick={onCreate}
        >
          CREATE
        </button>
      </div>
    </Panel>
  )
}

export default CreateNew
