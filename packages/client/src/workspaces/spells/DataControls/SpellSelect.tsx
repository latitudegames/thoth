import { useSnackbar } from 'notistack'

import { useAppDispatch } from '@/state/hooks'
import { openTab } from '@/state/tabs'
// import { useModule } from '../../../contexts/ModuleProvider'
import Select from '@components/Select/Select'
import {
  useLazyGetSpellQuery,
  useGetSpellsQuery,
  useNewSpellMutation,
} from '@/state/api/spells'
import defaultChain from '@/data/chains/default'
import { ChainData } from '@latitudegames/thoth-core/types'
import { useEffect } from 'react'

const SpellSelect = ({ control, updateData, initialValue, tab }) => {
  const dispatch = useAppDispatch()

  const [getSpell, { data: spell }] = useLazyGetSpellQuery()
  const { data: spells } = useGetSpellsQuery()
  const [newSpell] = useNewSpellMutation()

  const { enqueueSnackbar } = useSnackbar()
  const { dataKey } = control

  // Handle what happens when a new spell is selected and fetched
  useEffect(() => {
    if (!spell) return

    // here we send the whole spell so the control can modify the nodes sockets.
    // However, we only store the name of the spell after processing the full spell.
    update(spell)
    _openTab(spell)
  }, [spell])

  const optionArray = () => {
    if (!spells) return
    return (
      spells
        // Make sure we don't allow someone to  select the current spell as a submodule.  No infinite loops.
        .filter(spell => spell.name !== tab.id)
        .map((spell, index) => ({
          value: spell.name,
          label: spell.name,
        }))
    )
  }

  const _openTab = async spell => {
    const tab = {
      name: spell.name,
      spellId: spell.name,
      type: 'spell',
      openNew: false,
      switchActive: false,
    }

    dispatch(openTab(tab))
  }

  // TODO fix on change to handle loading a single spell
  const onChange = async ({ value }) => {
    getSpell(value)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const onCreateOption = async value => {
    try {
      await newSpell({
        name: value,
        chain: defaultChain as unknown as ChainData,
      })

      getSpell(value)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Error creating module', err)
      enqueueSnackbar('Error creating module', {
        variant: 'error',
      })
    }
  }

  const noOptionsMessage = inputValue => {
    return <span>Start typing to find or creat a spell</span>
  }

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    return (
      inputValue.length !== 0
      // && selectOptions.some((option) => option.value !== inputValue)
    )
  }

  return (
    <div style={{ flex: 1 }}>
      <Select
        searchable
        creatable
        createOptionPosition="top"
        isValidNewOption={isValidNewOption}
        noOptionsMessage={noOptionsMessage}
        options={optionArray()}
        onChange={onChange}
        defaultInputValue={initialValue}
        onCreateOption={onCreateOption}
        placeholder="select module"
      />
    </div>
  )
}

export default SpellSelect
