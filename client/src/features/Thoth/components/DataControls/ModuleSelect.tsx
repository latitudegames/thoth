import { useSnackbar } from 'notistack'

import { useModule } from '../../../../contexts/ModuleProvider'
import { useTabManager } from '../../../../contexts/TabManagerProvider'
import Select from '../../../common/Select/Select'

const ModuleSelect = ({ control, updateData, initialValue }) => {
  const { modules, newModule, findOneModule } = useModule()
  const { openTab } = useTabManager()
  const { enqueueSnackbar } = useSnackbar()

  const optionArray = () => {
    return modules.map((module, index) => ({
      value: module.id,
      label: module.name,
    }))
  }

  const onChange = async ({ value }) => {
    const _module = await findOneModule({ id: value })
    if (!_module) {
      enqueueSnackbar('No module found', {
        variant: 'error',
      })
      return
    }
    update(_module.id, value)

    const module = _module.toJSON()

    await openTab({
      name: value,
      type: 'module',
      moduleId: module.id,
      openNew: false,
    })
  }

  const update = (moduleKey, update) => {
    updateData({ [moduleKey]: update })
  }

  const onCreateOption = async value => {
    console.log('Creating Module:', value)
    try {
      const module = await newModule({ name: value })
      await openTab({
        name: value,
        type: 'module',
        moduleId: module.id,
        openNew: false,
      })

      // todo better naming for rete modules.
      // Handle displaying name as using ID for internal mapping
      update(module.id, value)

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
