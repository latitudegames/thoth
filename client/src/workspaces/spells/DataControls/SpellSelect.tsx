import { useSnackbar } from 'notistack'

import { useAppDispatch } from '@/state/hooks'
import { openTab } from '@/state/tabs'
// import { useModule } from '../../../contexts/ModuleProvider'
import Select from '@components/Select/Select'
import { useGetSpellsQuery, useNewSpellMutation } from '@/state/api/spells'
import defaultChain from '@/data/chains/default'
import { ChainData } from '@latitudegames/thoth-core/types'

const ModuleSelect = ({ control, updateData, initialValue }) => {
  const dispatch = useAppDispatch()

  const { data: spells } = useGetSpellsQuery()
  const [newSpell] = useNewSpellMutation()

  const { enqueueSnackbar } = useSnackbar()
  const { dataKey } = control

  const optionArray = () => {
    if (!spells) return
    return spells.map((module, index) => ({
      value: module.name,
      label: module.name,
    }))
  }

  const _openTab = async spell => {
    const tab = {
      name: spell.name,
      type: 'spell',
      moduleName: spell.name,
      openNew: false,
    }

    dispatch(openTab(tab))
  }

  // TODO fix on change to handle loading a single spell
  const onChange = async ({ value }) => {
    // const _spell = await findOneModule({ name: value })
    // if (!_module) {
    //   enqueueSnackbar('No module found', {
    //     variant: 'error',
    //   })
    //   return
    // }
    // update(value)
    // const module = _module.toJSON()
    // await _openTab(module)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const onCreateOption = async value => {
    try {
      const spell = await newSpell({
        name: value,
        chain: defaultChain as unknown as ChainData,
      })

      await _openTab(spell)

      // todo better naming for rete modules.
      // Handle displaying name as using ID for internal mapping
      update(value)

      // add data to node
      //
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Error creating module', err)
      enqueueSnackbar('Error creating module', {
        variant: 'error',
      })
    }
  }

  const noOptionsMessage = inputValue => {
    return <span>Start typing to create a module</span>
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

export default ModuleSelect
