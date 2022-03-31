import { useSnackbar } from 'notistack'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'
import { useNavigate } from 'react-router-dom'

import { useNewSpellMutation } from '@/state/api/spells'
import { useTabManager } from '@/contexts/TabManagerProvider'
import Panel from '@/components/Panel/Panel'
import Input from '@/components/Input/Input'
import emptyImg from '../empty.png'
import enkiImg from '../enki.png'
import langImg from '../lang.png'
import css from '../homeScreen.module.css'
import TemplatePanel from '../components/TemplatePanel'
import defaultSpell from './spells/default'

const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

const templates = [
  { label: 'Starter', bg: emptyImg, graph: defaultSpell },
  { label: 'Language example', bg: langImg, graph: defaultSpell },
  { label: 'Enki example', bg: enkiImg, graph: defaultSpell },
]

const CreateNew = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [error, setError] = useState(null)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { openTab, clearTabs } = useTabManager()
  const [newSpell] = useNewSpellMutation()

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onCreate = handleSubmit(async data => {
    const placeholderName = uniqueNamesGenerator(customConfig)
    const name = data.name || placeholderName
    console.log('selectedTemplate is', selectedTemplate)
    const response = await newSpell({
      graph: selectedTemplate.graph,
      name,
    })

    if (response.error) {
      const message = response.error.data.error.message
      setError(message)
      enqueueSnackbar(`Error saving spell. ${message}.`, {
        variant: 'error',
      })
      return
    }

    await openTab({
      name: name,
      spellId: name,
      type: 'spell',
    })

    setTimeout(() => navigate('/thoth'), 500)
  })

  return (
    <Panel shadow flexColumn>
      <h1> Create New </h1>
      <div className={css['spell-details']}>
        <form>
          <label className={css['label']} htmlFor="">
            Spell name
          </label>
          <input
            type="text"
            className={css['input']}
            defaultValue=""
            {...register('name')}
          />
          {error && <span className={css['error-message']}>{error}</span>}
        </form>
      </div>
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
            template={template}
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
